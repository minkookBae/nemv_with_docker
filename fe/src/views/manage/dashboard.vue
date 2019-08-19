<template>
  <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs">
    <v-layout wrap row>
      <v-flex xs12 sm6 md3 class="pb-2">
        <small-card
          title="미해결 이슈"
          :number = count
          tIcon="help"
          tIconColor="success"
          
        ></small-card>
      </v-flex>
      <v-flex xs12 sm6 md3 class="pb-2">
        <small-card
          title="전체 사용자"
          :number = people
          tIcon="person"
          tIconColor="primary"

        ></small-card>
      </v-flex>

      <v-flex xs12 sm6 md3 class="pb-2">
        <small-card
          title="전체 조회수"
          :number = total
          tIcon="visibility"
          tIconColor="info"

        ></small-card>
      </v-flex>

      <v-flex xs12 sm6 md3 class="pb-2">
        <small-card
          title="전체 이슈"
          :number = article_count
          tIcon="view_module"
          tIconColor="warning"

        ></small-card>
      </v-flex>

      <v-flex xs12 sm4 class="pb-2">
        <trend-card
          title="주간 이슈 현황"
          :data="[4, 7, 9, 5, 6, 4, 5]"
          :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
        ></trend-card>
      </v-flex>
      <v-flex xs12 sm4 class="pb-2">
        <trend-card
          title="주간 사용자 현황"
          :data="[3, 1, 2, 1, 0, 4, 2]"
          :gradient="['red', 'orange', 'yellow']"
        ></trend-card>
      </v-flex>
      <v-flex xs12 sm4 class="pb-2">
        <trend-card
          title="주간 조회수 현황"
          :data="[33, 22, 2, 43, 33, 1, 55]"
          :gradient="['blue', 'green', 'sky']"
        ></trend-card>
      </v-flex>

      <v-flex xs12 sm6 class="pb-2">
        
      </v-flex>
      <v-flex xs12 sm6 class="pb-2">
        <board-card></board-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import smallCard from '@/components/dashboard/smallCard'
import trendCard from '@/components/dashboard/trendCard'
import boardCard from '@/components/dashboard/boardCard'

export default {
  components: {
    smallCard,
    trendCard,
    boardCard
  },

  data () {
    return {
      count : 0,
      people : 0,
      articles : {},
      total : 0,
      article_count : 0
    }
  },

  mounted() {
    this.getDashBoard2()
    this.getDashBoard3()
    this.getDashBoard4()
    this.getDashBoard5()
  },
  methods : {
      getDashBoard2() {
        this.$axios.get(`article/dashboard2`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.count = data.count
          return this.count
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          console.log(e.message)
        })
      },
      getDashBoard3() {
        this.$axios.get(`sign/dashboard3`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.people = data.count
          return this.people
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          console.log(e.message)
        })
      },

      getDashBoard4() {
        this.$axios.get(`article/dashboard4`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.articles = data.d
          for(var i =0 ; i <this.articles.length ; i++){
            this.total += this.articles[i].cnt.view
          }
          return this.total
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          console.log(e.message)
        })
      },

      getDashBoard5() {
        this.$axios.get(`article/dashboard5`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.article_count = data.count
          return this.article_count
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
          console.log(e.message)
        })
      }
    

  }
  
}
</script>