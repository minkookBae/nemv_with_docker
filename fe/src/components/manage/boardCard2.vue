<template>
    <v-container>
        <v-card>
            <template v-if="!edit">
            <v-card-title primary-title>
                <h3 class="headline mb-0">{{board.name}}</h3>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
                <div>권한: {{board.lv}}</div>
                <div>설명: {{board.rmk}}</div>
                <div>라벨:
                    <br>
                    <template v-for="(item, i) in board.labels">
                        <span :key="i">{{i+1}}번째 : {{item}}<br></span>
                    </template>
                </div>
            </v-card-text>

            <v-divider light></v-divider>
            <v-card-actions>
                <v-btn flat color="green" @click="addLabel()">라벨추가</v-btn>
                <v-btn flat color="orange" @click="modeChange(board)">라벨삭제</v-btn>
            </v-card-actions>
            </template>
            <template v-else>
            <v-card-title>
                <span class="headline">라벨 삭제</span>
            </v-card-title>
            <v-card-title>
                게시판 이름 : {{board.name}}
            </v-card-title>
                
            <template v-for="(item, i) in board.labels">
                <v-card :key="i+300">
                    <span :key="i">{{i+1}}번째 : {{item}}</span>
                    <v-btn :key="i+100" icon @click="delLabel(board, item)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                <br :key="i+200">
                </v-card>
            </template>
            

            <v-card-text>
            </v-card-text>
            </template>

            <v-card-text v-if="ma.act">
            <v-alert v-model="ma.act" :type="ma.type" dismissible>{{ma.msg}}</v-alert>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
            <v-card-title>
            <span class="headline">라벨 추가</span>
            </v-card-title>
            <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12 sm12 md12>
                    <v-card-title>게시판 이름 : <b>{{ board.name }}</b></v-card-title>
                </v-flex>
                <v-flex xs12 sm12>
                    <v-text-field
                    label="추가할 라벨명"
                    hint="추가할 라벨 명"
                    persistent-hint
                    required
                    v-model="labels"
                    ></v-text-field>
                </v-flex>
                </v-layout>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="addLabel2(board)">확인</v-btn>
            <v-btn color="red darken-1" flat @click.native="dialog = false, labels = ''">취소</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-container>
</template>
<script>

export default {
  props: [ 'board' ],
  data () {
    return {
    dialog : false,
      ma: {
        act: false,
        msg: '',
        type: 'error'
      },
      lvs: [0, 1, 2, 3],
      form: {
        name: '',
        lv: 0,
        rmk: ''
      },
      labels : '',
      body : {},
      edit: false
    }
  },
  methods: {
    modeChange (b) {
      this.edit = true
      this.form = {
        name: b.name,
        lv: b.lv,
        rmk: b.rmk
      }
    },
    mod (board) {
      if (board.name === this.form.name && board.rmk === this.form.rmk && board.lv === this.form.lv) {
        return this.$store.commit('pop', { msg: '변경한 것이 없습니다.', color: 'warning' })
      }

      this.$axios.put(`manage/board/${board._id}`, this.form)
        .then((r) => {
          if (!r.data.success) throw new Error(r.data.msg)
          board.name = this.form.name
          board.rmk = this.form.rmk
          board.lv = this.form.lv
          this.edit = false
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    pop (m, t) {
      if (this.ma.act) return
      this.ma.act = true
      this.ma.msg = m
      this.ma.type = t
      setTimeout(() => {
        this.ma.act = false
      }, 6000)
    },
    addLabel () {
        this.dialog = true
    },
    addLabel2 (board) {
        if(this.labels === '') return this.$store.commit('pop', {msg : "라벨명을 입력해주세요.", color : 'warning'})
        this.body.name = this.labels
        if(board.labels.includes(this.labels)) return this.$store.commit('pop', {msg : "이미 존재하는 라벨입니다.", color : 'warning'})
        this.$axios.put(`manage/board/label/${board._id}`,this.body)
        .then((r) => {
            if(!r.data.success) throw new Error(r.data.msg)
            this.labels = ''
            this.dialog = false
            this.$router.go()
        })
        .catch((e)=>{
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    delLabel (board, name){
        var temp = {}
        temp.name = name
        this.$axios.put(`manage/board/label_del/${board._id}`, temp)
        .then((r) => {
            if(!r.data.success) throw new Error(r.data.msg)
            this.dialog = false
            this.$router.go()
        })
        .catch((e)=>{
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })        
    }
  }
}
</script>

<style scoped>
.padding_5{
    padding: 5px;
}
</style>