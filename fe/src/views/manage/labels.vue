<template>
  <v-container grid-list-md>
    <v-alert
      :value="!boards.length"
      type="warning"
    >
      데이터가 없습니다
    </v-alert>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 v-for="board in boards" :key="board._id">
        <board-card-2 :board="board" @list="list"></board-card-2>
      </v-flex>
    </v-layout>

    <v-snackbar
      v-model="sb.act"
    >
      {{ sb.msg }}
      <v-btn
        :color="sb.color"
        flat
        @click="sb.act = false"
      >
        닫기
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import boardCard2 from '@/components/manage/boardCard2'

export default {
  components: { boardCard2 },
  data () {
    return {
      boards: [],
      dialog: false,
      lvs: [0, 1, 2, 3],
      form: {
        name: '',
        rmk: '',
        lv: 0
      },
      selected: 0,
      sb: {
        act: false,
        msg: '',
        color: 'error'
      }
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    addDialog () {
      this.dialog = true
      this.form = {
        name: '',
        rmk: '',
        lv: 0
      }
    },
    add () {
      if (!this.form.name) return this.$store.commit('pop', { msg: '이름을 작성해주세요', color: 'warning' })
      this.$axios.post('manage/board', this.form)
        .then((r) => {
          this.dialog = false
          this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    list () {
      this.$axios.get('manage/board')
        .then(({ data }) => {
          this.boards = data.ds
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    pop (m, c) {
      this.sb.act = true
      this.sb.msg = m
      this.sb.color = c
    }
  }
}
</script>
