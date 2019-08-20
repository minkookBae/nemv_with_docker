<template>
  <div class="card-scene" v-if="loading">
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div :class="column.props.className">
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            <b>{{ column.name }}</b>
          </div>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in column.children" :key="card.id">
              <div :class="card.props.className" :style="card.props.style">
                {{card.data}}
              </div>
            </Draggable>
          </Container>
        </div>
      </Draggable>
    </Container>
    <div style="text-align:center;">
      <v-btn @click="save_label(article)" color="success">저장</v-btn>
      <v-btn @click.native="cancel()" color="warning">취소</v-btn>
      </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag, generateItems } from './utils/helpers'
const columnNames = ['등록된 라벨', '라벨 리스트']
const cardColors = [
  'azure',
  'beige',
  'bisque',
  'blanchedalmond',
  'burlywood',
  'cornsilk',
  'gainsboro',
  'ghostwhite',
  'ivory',
  'khaki'
]
const pickColor = () => {
  const rand = Math.floor(Math.random() * 10)
  return cardColors[rand]
}

const scene = {
  type: 'container',
  props: {
    orientation: 'horizontal'
  },
  children: 
    [{
    id: `column${0}`,
    type: 'container',
    name: columnNames[0],
    props: {
      orientation: 'vertical',
      className: 'card-container'
    },
    children: 
    [
      //등록된 라벨
    ]},

    {
    id: `column${1}`,
    type: 'container',
    name: columnNames[1],
    props: {
      orientation: 'vertical',
      className: 'card-container'
    },
    children: 
    [
      // 라벨 리스트
    ]}
    ]
  

}

export default {

  name: 'Cards',
  components: {Container, Draggable},
  props : ["board" , "article"],
  data () {
    return {
      scene,
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
      labels : [],
      labels2 : [],
      loading : false
    }
  },
  mounted(){

    this.article_label(this.article)


  },
  methods: {
    onColumnDrop (dropResult) {
      const scene = Object.assign({}, this.scene)
      scene.children = applyDrag(scene.children, dropResult)
      this.scene = scene
    },
    onCardDrop (columnId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.scene)
        const column = scene.children.filter(p => p.id === columnId)[0]
        const columnIndex = scene.children.indexOf(column)
        const newColumn = Object.assign({}, column)
        newColumn.children = applyDrag(newColumn.children, dropResult)
        scene.children.splice(columnIndex, 1, newColumn)
        this.scene = scene
      }
    },
    getCardPayload (columnId) {
      return index => {
        return this.scene.children.filter(p => p.id === columnId)[0].children[index]
      }
    },
    dragStart () {
    //   console.log('drag started')
    },
    log (...params) {
    //   console.log(...params)
    },
    board_label(board){
      this.$axios.get(`/board/read/${board}`)
      .then((r)=>{
        if(!r.data.success) throw new Error(r.data.msg)
        this.labels = r.data.d.labels
        var temp = []
        for(var i = 0; i< this.labels.length ; i++){
          if(!this.labels2.includes(this.labels[i])){
            temp.push(this.labels[i])
          }
        }

        for(var i = 0; i< temp.length ; i++){
          var temp2 = {type : 'draggable', id : `${1}${i}`, props: {className : 'card', style : {backgroundColor : pickColor()}}, data: temp[i]}
          this.scene.children[1].children.push(temp2)
        }
      
        //리스트에 추가
      
      })
      .then(r=>{
        this.loading = true
      })
      .catch((e)=>{
        if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
      })
    },
    article_label(article){

      this.$axios.get(`/article/${article}`)
      .then((r)=>{
        if(!r.data.success) throw new Error(r.data.msg)
        this.labels2 = r.data.d.labels
        
        for(var i = 0; i < this.labels2.length ; i++){
          var temp2 = {type : 'draggable', id : `${0}${i}`, props: {className : 'card', style : {backgroundColor : pickColor()}}, data: this.labels2[i]}
          this.scene.children[0].children.push(temp2)
        }
        
      })
      .then((r)=>{
        this.board_label(this.board)
      })
      .catch((e)=>{
        if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })      
      })
    },
    
    save_label(article){
      var data = {register : this.scene.children[0].children}
      this.$axios.put(`/article/label/${article}`, data)
      .then((r)=>{
        if(!r.data.success) throw new Error(r.data.msg)
        this.$router.go()
      })
      .catch(e=>{
        if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })      

      })
    }
    ,
    cancel(){
      this.$router.go()
    }

  }
}
</script>


<style scoped>
@import url(./assets/demos.css);
/* @import url(./assets/form.css); */
@import url(./assets/header.css);
@import url(./assets/layout.css);
@import url(./assets/nav.css);

</style>

