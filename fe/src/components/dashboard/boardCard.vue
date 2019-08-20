<template>
  <v-card height="100%">
    <v-toolbar color="orange" flat>
      <v-toolbar-title>최근 이슈</v-toolbar-title>
      <v-spacer></v-spacer>


    </v-toolbar>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
        >
          {{ item.header }}
        </v-subheader>

        <v-divider
          v-else-if="item.divider"
          :inset="item.inset"
          :key="index"
        ></v-divider>

        <v-list-tile
          v-else
          :key="item.title"
          
        >
          <v-list-tile-content>
              <v-list-tile-title><b>{{item.title}} - {{item.name}}</b></v-list-tile-title>
              <v-list-tile-sub-title>
                <viewer v-model="item.content"/>
              
              </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      articles : {},
      count : 0,
      items: [

      ]
    }
  },
  mounted(){
    this.getDashBoard()
  },
  methods : {
      getDashBoard() {
        this.$axios.get(`article/dashboard`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.articles = data.ds
          return this.articles
        })
        .then(r=>{
          if(!r) throw new Error('글이 없습니다.')
          if(r.length === 3){
            for(var i = 0 ; i < 3 ; i++){
              
              var temp = {title : this.articles[i].title, content : this.articles[i].content, name : ''}
              if(this.articles[i]._user) temp.name = this.articles[i]._user.name
              else temp.name = "손님"

              this.items.push(temp)
            }
          }
          else{
            for(var i = 0 ; i < r.length ; i++){
              
              var temp = {title : this.articles[i].title, content : this.articles[i].content, name : ''}
              if(this.articles[i]._user) temp.name = this.articles[i]._user.name
              else temp.name = "손님"

              this.items.push(temp)
            }            
          }
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
        })
      }

  }

}
</script>