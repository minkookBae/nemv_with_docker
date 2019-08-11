<template>
  <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="headline">
              <v-tooltip bottom>
                <span slot="activator">{{board.name}}</span>
                <span>{{board.rmk}}</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="params.search"
                append-icon="search"
                label="검색"
                clearable
                style="width:40px"
              ></v-text-field>
            </v-card-title>

          <v-data-table
            :headers="headers"
            :items="articles"
            :total-items="pagination.totalItems"
            :pagination.sync="pagination"
            rows-per-page-text=""
            hide-actions
            :loading="loading"
            class="text-no-wrap"
            disable-initial-sort>
            <template slot="items" slot-scope="props">
              <td :class="headers[0].class"><a @click="read(props.item)"> {{ props.item.title }}</a></td>
              <td :class="headers[1].class">{{ props.item._user ? props.item._user.id : '손님' }}</td>
              <td :class="headers[2].class">{{ props.item.cnt.view }}</td>
              <td :class="headers[3].class">{{ props.item.cnt.like }}</td>
              <td :class="headers[4].class">{{ id2date(props.item._id)}}</td>

            </template>
            <template slot="no-data">
              <v-alert :value="true" color="error" icon="warning">
                검색 결과가 없습니다.
              </v-alert>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
              <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
          </div>
        </v-card>
      </v-flex>
    </v-layout>

    <v-btn
      color="pink"
      dark
      small
      absolute
      bottom
      right
      fab
      @click="addDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card light v-if="!dlMode">
        <v-card-title>
          <span class="headline">{{selArticle.title}}</span>
          <v-spacer></v-spacer>
          <v-btn
              icon
              @click="dialog=!dialog"
          >
            <v-icon>clear</v-icon>
          </v-btn>

        </v-card-title>
        <v-card-text>
          <viewer v-model="selArticle.content" />
          
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning darken-1" flat @click.native="modDialog()">수정</v-btn>
          <v-btn color="error darken-1" flat @click.native="ca=true">삭제</v-btn>
          <v-btn color="success darken-1" flat @click.native="dialog = false">닫기</v-btn>
        </v-card-actions>
        
         <v-card-text v-if="ca">
          <v-alert v-model="ca" type="warning">
            <h4>정말 진행 하시겠습니까?</h4>
            <v-btn color="error" @click="del()">확인</v-btn>
            <v-btn color="secondary" @click="ca=false">취소</v-btn>
          </v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-list two-line v-for="comment in selArticle._comments" :key="comment._id">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{comment.content}}</v-list-tile-title>
              <v-list-tile-sub-title>{{comment._user ? comment._user.id : '손님'}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                  icon
                  ripple
                  @click="commentDialogOpen(comment)"
              >
                <v-icon color="warning lighten-1">
                  create
                </v-icon>
              </v-btn>

             </v-list-tile-action>
            <v-list-tile-action>
              <v-btn
                  icon
                  ripple
                  @click="delComment(comment)"
              >
                <v-icon color="error">
                  clear
                </v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
        <v-card-text>
          <v-text-field
          label="댓글 작성"
          v-model="formComment.content"
          append-icon="message"
          @keyup.enter = "addComment()"
          >
          </v-text-field>
        </v-card-text>
      </v-card>
      <v-card light v-else>
        <v-card-title>
          <span class="headline">글 {{(dlMode === 1) ? '작성' : '수정'}}</span>
          <v-spacer></v-spacer>
          <v-btn
              icon
              @click="dialog=!dialog"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md style="padding:0px;">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="제목"
                  persistent-hint
                  required
                  v-model="form.title"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <editor
                  required
                  v-model="form.content"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="(dlMode === 1) ? add() : mod()">확인</v-btn>
          <v-btn color="red darken-1" flat @click.native="dialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <v-dialog width="400" v-model="commentDialog">
      <v-card>
        <v-card-text>
          <v-text-field
              label="댓글 수정"
              v-model="selComment.content"
              @keyup.enter="modComment()"
          >

           </v-text-field>

         </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="modComment()">
            수정
          </v-btn>
          <v-btn color="secondary" @click="commentDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>

     </v-dialog>
  </v-container>
</template>


<script>
import boardCard from '@/components/manage/boardCard'
export default {
  components: { boardCard },
  data () {
    return {
      board: {
        name: '로딩중...',
        rmk: '무엇?'
      },
      articles: [],
      dialog: false,
      commentDialog : false,
      lvs: [0, 1, 2, 3],
      form: {
        title: '',
        content: ''
      },
      response : '',
      headers: [
        { text: '제목', value: 'title', sortable: true, align: 'left' },
        { text: '글쓴이', value: '_user', sortable: false },
        { text: '조회수', value: 'cnt.view', sortable: true },
        { text: '추천', value: 'cnt.like', sortable: true },
        { text: '날짜', value: '_id', sortable: true, class: 'hidden-sm-and-down' }
      ],
      loading: false,
      itemTotal: 0,
      pagination: {},
      getTotalPage: 1,
      dlMode: 0, // 0: read, 1: write, 2: modify
      selArticle: {
        _comments : []
      },
      selComment : {
        content : ''
      },
      ca: false,
      params: {
        draw: 0,
        search: '',
        skip: 0,
        sort: '_id',
        order: 0,
        limit: 1
      },
      timeout: null,
      formComment : {
        content : ''
      }
    }
  },
  mounted () {
    this.getBoard()
  },
  watch: {
    pagination: {
      handler() {
        this.list()
      },
      deep: true
    },
    'params.search': {
      handler() {
        this.delay()
        // this.list()
      }
    },
    '$route' (to, from){
      this.getBoard()
    }
  },
  computed: {
    setSkip () {
      if (this.pagination.page <= 0) return 0
      return (this.pagination.page - 1) * this.pagination.rowsPerPage
    },
    setSort () {
      let order = this.pagination.sortBy
      if (!this.pagination.sortBy) order = '_id'
      return order
    },
    setOrder () {
      return this.pagination.descending ? 1 : -1
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
  },
  methods: {
    commentDialogOpen (c) {
      this.commentDialog = true
      this.selComment = c
    },


    addDialog () {
      this.dialog = true
      this.dlMode = 1
      this.form = {
        title: '',
        content: ''
      }
    },
    modDialog () {
      this.dlMode = 2
      this.form = {
        title: this.selArticle.title,
        content: this.selArticle.content
      }
    },
    getBoard () {
      this.$axios.get(`board/read/${this.$route.params.name}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.board = data.d
          this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    add () {
      if (!this.form.title) return this.$store.commit('pop', { msg: '제목을 작성해주세요', color: 'warning' })
      if (!this.form.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
      this.$axios.post(`article/${this.board._id}`, this.form)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.dialog = false
          this.$store.commit('pop',{msg : "이슈가 추가되었습니다", color : "success"})
          this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    list () {
      if (this.loading) return
      if (!this.board._id) return
      this.loading = true
      // const params = {
      //   draw: (this.params.draw += 1),
      //   // search: this.search,
      //   skip: this.setSkip,
      //   limit: this.pagination.rowsPerPage,
      //   order: this.setOrder,
      //   sort: this.setSort
      // }
      this.params.draw ++
      this.params.skip = this.setSkip
      this.params.limit = this.pagination.rowsPerPage
      this.params.sort = this.setSort
      this.params.order = this.setOrder
      this.$axios.get(`article/list/${this.board._id}`, { params: this.params })
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.pagination.totalItems = data.t
          this.articles = data.ds
          this.loading = false
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          this.loading = false
        })
    },
    read (atc) {
      this.selArticle = atc
      this.loading = true
      this.$axios.get(`article/read/${atc._id}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.dlMode = 0
          this.dialog = true
          this.selArticle.content = data.d.content
          this.selArticle.cnt.view = data.d.cnt.view
          this.selArticle._comments = data.d._comments
          this.loading = false
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          this.loading = false
        })
    },
    mod () {
      if (!this.form.title) return this.$store.commit('pop', { msg: '제목을 작성해주세요', color: 'warning' })
      if (!this.form.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
      if (this.selArticle.title === this.form.title && this.selArticle.content === this.form.content)
        return this.$store.commit('pop', { msg: '변경된 내용이 없습니다', color: 'warning' })
      this.$axios.put(`article/${this.selArticle._id}`, this.form)
        .then(({ data }) => {
          this.dialog = false
          if (!data.success) throw new Error(data.msg)
          this.selArticle.title = data.d.title
          this.selArticle.content = data.d.content
          // this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    del () {
      this.$axios.delete(`article/${this.selArticle._id}`)
        .then(({ data }) => {
          this.dialog = false
          if (!data.success) throw new Error(data.msg)
          this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    id2date (val) {
      if (!val) return '잘못된 시간 정보'
      return new Date(parseInt(val.substring(0, 8), 16) * 1000).toLocaleString()
    },
    delay () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.list()
      }, 1000)
    },
    addComment () {
      this.$axios.post(`comment/${this.selArticle._id}`, this.formComment)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.formComment.content = ''
          this.read(this.selArticle)
          // this.list()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    delComment (cmt) {
      this.$axios.delete(`comment/${cmt._id}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.read(this.selArticle)
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
    },
    modComment () {
      if (!this.selComment.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
      this.commentDialog = false
      this.$axios.put(`comment/${this.selComment._id}`, { content: this.selComment.content })
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.read(this.selArticle)
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })    
  }
  }
}
</script>