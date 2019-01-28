let text1 = `/*
* 面试官你好，我是洪凯
* 首先我想简单的介绍我自己
* 只是以文字介绍太单调了
* 我就用代码来展示吧
* 首先准备一些样式
*/
*{
    transition:all 1s;
}
html{
    background:#fff8dc;
}
#pre{
    padding:10px;
}
/*现在我需要使一些代码高亮*/
.token.selector{
    color: #690;
}
.token.property{
    color: #905;
}
.token.function{
    color: #dd4a68;
}
/*现在需要一点3D效果*/
#pre{
    transform:rotateX(360deg);
}
/*下面开始进入正题，介绍一下自己吧 */
/* 首先，我需要一张白纸 */
`

let text2 = `
#pre{
    position:fixed;
    left:0;
    height:100%;
    width:50%;
}
#paper{
    position:fixed;
    right:0;
    width:50%;
    height:100%;
    background:grey;
    display:flex;
    justify-content:center;
    align-items:center;
}
#paper #content{
    background:white;
    width:98%;
    height:98%;
}
/*下面我们干脆把MARKDOWN内容也变为html模式吧*/
`
let note = `
#自我介绍：

姓名：洪 凯
意向岗位：前端开发工程师
已熟练掌握的技术栈：Javascript,ES6,Bootstrap,html,css,git,webpack等
熟悉后端语言:python
喜欢敏捷开发，研究新技术
关注前端发展潮流，勇于尝试使用新技术

#项目介绍：

1、类似苹果风格轮播
2、跳动的简历
3、CANVAS画板
4、网易云音乐
5、VUE造轮子

#个人信息：

联系方式：15051885755
E-mail：952817116@qq.com
gitHub: github.com/hongkai27
weibo: 沉默的咖啡壶



`
writeCode('', text1, () => {
    createPaper(() => {
        writeCode(text1, text2,()=>{
            writeMarkdown(note)
        })
    })
})

/*................................ */
function writeCode(before, code, fn) {//before是前缀内容
    let preCode = document.querySelector('#pre')
    let n = 0
    let time1 = setInterval(() => {  //preCode.innerHTML通过把code在高亮库加工再赋值
        n += 1
        preStyle.innerHTML = before + code.substring(0, n)
        preCode.innerHTML = Prism.highlight(before + code.substring(0, n), Prism.languages.css)
        preCode.scrollTop = preCode.scrollHeight//没有滚动条时，代码向下滚动，防止代码看不见
        if (n > code.length) {
            window.clearInterval(time1)
            fn.call()
        }
    },10)
}

function createPaper(fn) {
    let paper = document.createElement('div')
    paper.id = 'paper'
    document.body.appendChild(paper)
    let content = document.createElement('pre')
    content.id = 'content'
    paper.appendChild(content)
    fn.call()
}

function writeMarkdown(note,fn){
    let content = document.querySelector('#paper > #content')
    let n = 0
    let time = setInterval(() => {
        n += 1
        content.innerHTML = note.substring(0, n)
        content.scrollTop = content.scrollHeight
        if (n > note.length) {
            window.clearInterval(time)
            fn.call()
        }
    },10)
}
