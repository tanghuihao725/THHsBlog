// import Vue from 'vue'
// import Vuex from 'vuex'
import App from './App.vue'
import { resolve, reject } from 'q';

Vue.use(Vuex)


export const store = new Vuex.Store({
    state: {
        userInfo: Bmob.User.current(),
        isLogin: !!Bmob.User.current(),
        user: "游客" + parseInt(Math.random() * 1000000),
        comments_default: 10, //默认显示评论数量
        comment_pipe: "",//评论系统间传递消息
        comments: [],
        toolbars: {
            // 增加博客时使用的编译器参数
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: true, // 下划线
            mark: true, // 标记
            superscript: true, // 上角标
            quote: true, // 引用
            ol: true, // 有序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            help: true, // 帮助
            code: true, // code
            subfield: true, // 是否需要分栏
            fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            /* 1.3.5 */
            undo: true, // 上一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: true, // 导航目录
        },
        toolbars_phone: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: false, // 下划线
            mark: false, // 标记
            superscript: false, // 上角标
            quote: true, // 引用
            ol: true, // 有序列表
            link: false, // 链接
            imagelink: false, // 图片链接
            help: false, // 帮助
            code: true, // code
            subfield: false, // 是否需要分栏
            fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            /* 1.3.5 */
            undo: false, // 上一步
            trash: true, // 清空
            save: false, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: false // 导航目录
        }

    },
    getters: {
        isLogin: (state) => state.isLogin,
        user: state => { return !!state.userInfo ? state.userInfo.netname : state.user },
        isMobile: () => { return !(window.matchMedia('(min-width:768px)')).matches },
        toolbars: (state) => state.toolbars,
        toolbars_phone: (state) => state.toolbars_phone,
        comments_default: (state) => state.comments_default,
        get_pipe: (state) => state.comment_pipe,
        get_comments:(state)=>{
            return state.comments
        }




    },
    mutations: {
        login: (state, res) => {
            state.isLogin = true;
            state.userInfo = res;
        },
        quit: (state) => {
            Bmob.User.logout()
            state.userInfo.netname = "游客" + parseInt(Math.random() * 1000000);
            setTimeout(() => state.isLogin = false, 1000);
        },
        set_pipe: (state, data) => {
            state.comment_pipe = data;
        },
        set_comments:(state,data)=>{
            state.comments = data;
        },
        add_comment:(state,obj)=>{
            state.comments.unshift(obj)
        },
        del_comment:(state,obj)=>{
            state.comments = state.comments.filter(comment=>obj.objectId!=comment.objectId)
        }

    },
    actions: {
        fetch_comments({commit},{belong_to}){
            return new Promise((resolve,rejected)=>{
                const query = Bmob.Query("comments");
                query.equalTo("belong_to", "==", belong_to);
                query.order("-createdAt");
                query.find().then(res=>{
                    commit('set_comments',res);
                    resolve(res);
                })
            })
        },
        add_comment({commit},obj){
            return new Promise((resolve,rejected)=>{
                const query = Bmob.Query("comments");
                query.set("from",obj.from);
                query.set('content',obj.content);
                query.set('belong_to',obj.belong_to)
                if(obj.to!=""){
                    query.set('to',obj.to);
                }
                query.save().then(res=>{
                    obj.objectId = res.objectId;
                    obj.createdAt = res.createdAt;
                    commit('add_comment',obj);
                    resolve(obj);
                })
            })
        },
        del_comment({commit},obj){
            const query = Bmob.Query("comments");
            query.destroy(obj.objectId).then(res=>{
                commit('del_comment',obj)
            })
        }
    }
})