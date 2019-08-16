<template>
    <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-layout row wrap>
            <v-flex xs12 md9>
                <template>
                    <v-card light>
                        <v-card-title class="headline">
                            <span style=""><b>{{issue.title}}</b></span>
                            {{issue.labels ? issue.labels.slice(0,).toString().replace(',',' ') : ''}}
                        </v-card-title>
                        <v-card-text style="padding-top : 0px; padding-bottom:0px;">
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
                    </v-card>
                </template>
                <!-- 이슈 내용 렌더링 -->
                <v-spacer><br></v-spacer>
                <template v-for="(item, i) in issue._comments">
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
                    <br :key = "i+2000">
                </template>
                <!-- 댓글 리스트 렌더링 -->

                <!-- 댓글 부분 시작 -->
                <template>
                    <v-card light>
                        <editor
                        required
                        v-model="formComment.content"
                        height = "200px"
                        />
                        <v-card-text style="text-align : right; padding-top : 4px; padding-bottom:4px;">
                            <v-btn color="success" @click="addComment()">
                                코멘트 작성
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </template>
            </v-flex>
            <v-flex>
                <v-card>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import moment from 'moment'
import 'highlight.js/styles/github.css'
export default {
    data () {
        return {
            dlMode : 0,
            issue : {},
            formComment : {
            }
            
        }
    },
    mounted(){
        this.read(this.$route.params.article_id)
        
    },
    methods : {
        read (issue_id) {
            this.$axios.get(`article/read/${issue_id}`)
                .then(({ data }) => {
                if (!data.success) throw new Error(data.msg)
                this.dlMode = 0
                this.issue = data.d
                })
                .catch((e) => {
                if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
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
        }
    }

}
</script>

<style>
    .title_area {
        background-color : whitesmoke
    }
</style>