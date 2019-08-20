<template>
    <v-container v-if="loading" fluid :grid-list-md="!$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-layout row wrap>
            <v-flex xs12 md9>
                <template>
                    <v-card light>
                        <v-card-title class="headline">
                            <span style=""><b>{{issue.title}}</b></span>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom class="tooltip-padding5">
                                <span style="float:right;" slot="activator"><v-icon @click.native="dialog = true, modLabeling()">label</v-icon></span>
                                <span>라벨을 관리합니다</span>
                            </v-tooltip>
                            <v-tooltip bottom class="tooltip-padding5">
                                <span style="float:right;" slot="activator"><v-icon @click.native="dialog = true, modDialog()">create</v-icon></span>
                                <span>이슈를 수정합니다</span>
                            </v-tooltip>
                            <v-tooltip bottom class="tooltip-padding5">
                                <span style="float:right;" slot="activator"><v-icon @click.native="dialog = true, ca=true">delete_forever</v-icon></span>
                                <span>이슈를 삭제합니다</span>
                            </v-tooltip>
                        </v-card-title>
                        <v-card-text style="padding-top : 0px; padding-bottom:0px;" :class="$vuetify.breakpoint.xs ? 'xs_text': ''">
                            <b>{{issue._user ? issue._user.name : '손님'}}</b> 님께서
                            <b>{{id2date_2(issue._id)}}</b> 에 이슈를 제시하셨습니다.
                            코멘트 : <b>{{issue.comments_count}}</b>개
                            
                            
                        </v-card-text>
                    </v-card>
                </template>
                <template> 
                    <!-- 이슈 내용 시작 -->
                    <v-card light>
                        <v-card-text>
                            <viewer v-model="issue.content" />

                        </v-card-text>
                        <v-card style="padding : 10px">
                            <template>
                                <v-tooltip bottom class="tooltip-padding5">
                                    <v-btn icon color="pink" @click="like()" slot="activator">
                                        <v-icon color="white">favorite</v-icon>
                                    </v-btn>
                                    <span>좋아요</span>
                                </v-tooltip>
                                <template>{{issue.like_member.length}}</template>

                            </template>
                            <!-- 좋아요 -->

                            <template>
                                <v-tooltip bottom class="tooltip-padding5">
                                    <v-btn icon color="blue" @click="dislike()" slot="activator">
                                        <v-icon color="white">thumb_down_alt</v-icon>
                                    </v-btn>
                                    <span>별로예요</span>
                                </v-tooltip>
                                <template>{{issue.dislike_member.length}}</template>
                            </template>

                            <!-- 별로예요 -->
                        </v-card>

                        
                    </v-card>
                </template>
                <!-- 이슈 내용 렌더링 -->
                <v-spacer><br></v-spacer>
                <template v-for="(item, i) in issue._comments">
                    <template v-if="!item.is_statusChange">
                        <v-card :key="i" light>
                            <v-card-text class="title_area">
                                <v-spacer></v-spacer>
                                <div><b>{{item._user ? item._user.name : '손님 '}}</b>님의 코멘트<span style="font-size:0.8rem; float:right;">{{id2date_2(item._id)}}</span></div>
                            </v-card-text>
                        </v-card>
                        <v-card :key="i+1000" light>
                            <v-card-text>
                                <viewer v-model="item.content" />
                            </v-card-text>
                        </v-card>
                    </template>
                    <template v-else>
                        <v-card :key="i" light>
                            <template v-if="item.is_openIssue">
                                <v-card-text class="close_area">
                                    <v-spacer></v-spacer>
                                    <div><b>{{item._user.name}}</b>님이 이슈를 닫았습니다.<span style="font-size:0.8rem; float:right;">{{id2date_2(item._id)}}</span></div>
                                </v-card-text>
                            </template>
                            <template v-else>
                                <v-card-text class="open_area">
                                    <v-spacer></v-spacer>
                                    <div><b>{{item._user.name}}</b>님이 이슈를 다시 여셨습니다.<span style="font-size:0.8rem; float:right;">{{id2date_2(item._id)}}</span></div>
                                </v-card-text>
                            </template>
                            <template v-if="item.content !== ''">
                                <v-card-text>
                                    <viewer v-model="item.content" />
                                </v-card-text>
                            </template>
                        </v-card>
                    </template>
                    <br :key = "i+2000">
                </template>
                <!-- 댓글 리스트 렌더링 -->

                <!-- 댓글 부분 시작 -->
                <v-spacer><br></v-spacer>
                <template>
                    <v-card light>
                        <editor
                        required
                        v-model="formComment.content"
                        mode="wysiwyg"
                        height = "200px"
                        />
                        
                        <v-card-text style="text-align : right;">
                            <!-- issue의 오픈 여부에 따라 달라짐 -->
                            <template v-if="issue.is_open">
                                <template v-if="formComment.content !== ''">
                                    <v-btn class="ma-1" @click="issueStatusChange_with_comment()">코멘트와 함께 이슈 닫기
                                        <v-icon color="green" right>check_circle</v-icon>
                                    </v-btn>
                                </template>
                                <template v-else>
                                    <v-btn class="ma-1" @click="issueStatusChange_with_comment()">이슈 닫기
                                        <v-icon color="green" right>check_circle</v-icon>
                                    </v-btn>                                    
                                </template>
                            </template>

                            <template v-else>
                                <template v-if="formComment.content !== ''">
                                    <v-btn class="ma-1" @click="issueStatusChange_with_comment()">코멘트와 함께 이슈 열기
                                        <v-icon color="orange" right>help</v-icon>
                                    </v-btn>
                                </template>
                                <template v-else>
                                    <v-btn class="ma-1" @click="issueStatusChange_with_comment()">이슈 열기
                                        <v-icon color="orange" right>help</v-icon>
                                    </v-btn>                                    
                                </template>                       
                            </template>

                            <v-btn class="ma-1" color="success" @click="addComment()">
                                코멘트 작성
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </template>
            </v-flex>
            
            <!-- 도움 주신 분, 관련 이슈 렌더링 -->
            <v-flex xs12 md3>
                <v-card>
                    <v-card-title>도움 주신 분</v-card-title>
                    <template v-for="(item, i) in help_list_name">
                    <v-card :key="i" light>
                        <v-card-text class="comment_help_area">
                            <div><b>{{item}}</b></div>
                        </v-card-text>
                    </v-card>                        
                    </template>
                </v-card>
                <v-card>
                    <v-card-title>관련 이슈</v-card-title>
                    <v-card>
                        <v-card-text class="label_area">
                            <b>{{issue._board.name}}</b>
                        </v-card-text>
                        <template v-for="(item, i) in issue.labels">
                            <v-card-text class="label_area" :key="i">
                                {{item}}
                            </v-card-text>
                        </template>
                    </v-card>
                </v-card>
            </v-flex>
        </v-layout>

<!-- dialog창 -->

        <v-dialog v-model="dialog" persistent max-width="700">
            <v-card light v-if="!dlMode">
                <v-card-title>
                    <span class="headline">{{issue.title}}</span>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        @click="dialog=!dialog, ca=false"
                    >
                        <v-icon>clear</v-icon>
                    </v-btn>

                </v-card-title>
                <v-card-text style="padding:0px 16px">
                    <span class="headline">{{issue.labels ? issue.labels.slice(0,).toString().replace(',',' ') : ''}}</span>
                </v-card-text>
                <v-card-text>
                    <viewer v-model="issue.content" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning darken-1" flat @click.native="modDialog()">수정</v-btn>
                    <v-btn color="error darken-1" flat @click.native="ca=true">삭제</v-btn>
                    <v-btn color="success darken-1" flat @click.native="dialog = false, ca = false">닫기</v-btn>
                </v-card-actions>

                <v-card-text v-if="ca">
                <v-alert v-model="ca" type="warning">
                    <h4>정말 진행 하시겠습니까?</h4>
                    <v-btn color="error" @click="del(), ca=false">확인</v-btn>
                    <v-btn color="secondary" @click="dialog = false, ca=false">취소</v-btn>
                </v-alert>
                </v-card-text>

            </v-card>

            <v-card light v-else-if="dlMode === 2">
                <v-card-title>
                <span class="headline">이슈 수정</span>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="dialog=!dialog, dlMode = 0"
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
                        previewStyle = "tab"
                        mode = "wysiwyg"
                        v-model="form.content"
                        />
                    </v-flex>
                    </v-layout>
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="mod()">확인</v-btn>
                <v-btn color="red darken-1" flat @click.native="dialog = false, dlMode = 0">취소</v-btn>
                </v-card-actions>
            </v-card>


            <v-card light v-else-if="dlMode === 3">
                <v-card-title>
                <span class="headline">라벨링 관리</span>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="$router.go()"
                >
                    <v-icon>clear</v-icon>
                </v-btn>
                </v-card-title>
                <v-card-text>
                <v-container grid-list-md style="padding:0px;">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <Card :board="issue._board.name" :article="issue._id" @cancel="cancel_label"/>
                        </v-flex>                    
                    </v-layout>

                </v-container>
                </v-card-text>

            </v-card>


        </v-dialog>



    </v-container>
</template>
<script>
import moment from 'moment'
import 'highlight.js/styles/github.css'
import Card from '@/components/label/card.vue'

export default {
    components : { Card },
    data () {
        return {
            loading : false,
            dlMode : 0,
            issue : {
                cnt : {
                    view : 0,
                },
                like_member : [],
                dislike_member : [],
                _board : {
                }

            },
            formComment : {
                content : ''
            },
            form: {
                title: '',
                content: ''
            },
            dialog : false,
            ca : false,
            help_list : {},
            help_list_name : [],
        }
    },
    mounted(){
        this.read(this.$route.params.article_id)
        
    },
    methods : {
        read (issue_id) {
            this.$axios.get(`article/read/${issue_id}`)
                .then(({ data }) => {
                if (!data.success){
                    this.$router.push('/e404')
                    throw new Error(404,'Page not found')
                    
                    }
                this.dlMode = 0
                this.issue = data.d
                this.help_list = data.d._comments
                this.set_helper()
                })
                .then(r=>{
                    this.loading = true
                })
                .catch((e) => {
                if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        set_helper(){
            for(var i = 0; i < this.help_list.length ; i++){
                if(this.help_list[i]._user)
                    if(!this.help_list_name.includes(this.help_list[i]._user.name))
                            this.help_list_name.push(this.help_list[i]._user.name)
            }
        }
        ,
        id2date (val) {
            moment.locale('ko')
            if (!val) return ''

            var time = moment(parseInt(val.substring(0, 8), 16) * 1000)
            var diff = moment().diff(moment(time))
            
            return time.format("YYYY년 MM월 DD일 HH시mm분")
        },

        id2date_2 (val) {
            moment.locale('ko')
            if (!val) return ''

            var time = moment(parseInt(val.substring(0, 8), 16) * 1000)
            var diff = moment().diff(moment(time))

            return moment(time).startOf('minute').fromNow()
        },

        addComment () {
            this.$axios.post(`comment/${this.issue._id}`, this.formComment)
                .then(({ data }) => {
                if (!data.success) throw new Error(data.msg)
                this.formComment.content = ''
                this.read(this.issue._id)
                // this.list()
                })
                .catch((e) => {
                if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        mod () {
            if (!this.form.title) return this.$store.commit('pop', { msg: '제목을 작성해주세요', color: 'warning' })
            if (!this.form.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
            if (this.issue.title === this.form.title && this.issue.content === this.form.content)
                return this.$store.commit('pop', { msg: '변경된 내용이 없습니다', color: 'warning' })
            this.$axios.put(`article/${this.issue._id}`, this.form)
                .then(({ data }) => {
                this.dialog = false
                if (!data.success) throw new Error(data.msg)
                this.issue.title = data.d.title
                this.issue.content = data.d.content
                this.dialog = false;
                this.dlMode = 0;
                this.ca = false;
                // this.$router.go()
                // this.list()
                })
                .catch((e) => {
                if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                this.dialog = false;
                this.dlMode = 0;
                this.ca = false;
                
                })
            },
        del () {
            this.$axios.delete(`article/${this.issue._id}`)
                .then(({ data }) => {
                this.dialog = false
                if (!data.success) throw new Error(data.msg)
                this.$router.go(-1)
                })
                .catch((e) => {
                if (!e.response) {
                    this.$store.commit('pop', { msg: e.message, color: 'warning' })
                    }
                else{
                    this.dialog = false;
                    this.ca = false;
                    this.dlMode = 0;
                }
                })
        },
        modDialog () {
            this.dlMode = 2
            this.form = {
                title: this.issue.title,
                content: this.issue.content
            }
        },
        like () {
            this.$axios.put(`article/like/${this.issue._id}`)
            .then((r) => {
                this.read(this.issue._id)

            })
            .catch((e) =>{
                this.$store.commit('pop', {msg : "손님은 좋아요 표시를 할 수 없습니다.", color : "warning"})
            })
        },
        dislike () {
            this.$axios.put(`article/dislike/${this.issue._id}`)
            .then((r) => {
                this.read(this.issue._id)

            })
            .catch((e) =>{
                this.$store.commit('pop', {msg : "손님은 싫어요 표시를 할 수 없습니다.", color : "warning"})

            })
        },
        issueStatusChange () {
            this.$axios.put(`article/status/${this.issue._id}`, this.issue)
            .then((r) =>{
                if(!r.data.success) this.$store.commit('pop', {msg : r.data.msg, color : "warning"})

                this.read(this.issue._id)
            })
            .catch(e =>{
                
                this.$store.commit('pop', {msg : e.message, color : "warning"})
            })
        },

        // 코멘트와 함께 저장함.
        async issueStatusChange_with_comment() {
            await this.issueStatusChange()
            await this.issueStatusChange_log()
        },

        issueStatusChange_log(){
            var temp = {a : this.formComment, b : this.issue.is_open}
            this.$axios.post(`comment/status/${this.issue._id}`, temp)
            .then((r)=>{
                this.formComment.content = ''
                if(!r.data.success){
                    this.$store.commit('pop', {msg : r.data.msg, color : "warning"})
                }

                this.read(this.issue._id)
            })
            .catch((e)=>{
                this.$store.commit('pop', {msg : e.message, color : "warning"})
            })
        },
        modLabeling (){
            this.dlMode = 3
        },
        cancel_label : function(){
            this.dlMode = 0
            this.dialog = false
        }


    }

}
</script>

<style>
    .title_area {
        background-color : whitesmoke
    }

    .open_area{
        background-color: lightgreen
    }

    .close_area{
        background-color: lightpink
    }

    .tooltip-padding5 {
        padding : 5px;
    }

    .xs_text {
        font-size: 0.8rem;
    }
    .comment_help_area {
        background-color: lavenderblush
    }
    .label_area{
        background-color: aliceblue
    }


</style>