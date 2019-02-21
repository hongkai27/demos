makedata()


let model = {  //moudel只做两件事，fetch获取数据，update更新数据
    data: {
        name: '',
        number: '',
    },
    fetch(id) {
        return axios.get(`/books/${id}`).then((response) => {  //成功了之后拿到一个response
            this.data = response.data //先把得到的数据记下来
            return response  //因为return了response，后面才能以response为主体继续then
        })
    },
    update(id, data) {
        return axios.put(`/books/${id}`, data).then((response) => {
            this.data = response.data
            return response
        })
    }
}

let view = new Vue({
    el: '#app',//要操作的元素是#app
    data: {
        book: {  //在vue中，data可以当做不存在，直接取data里面的book里面的值，view.book.name
            name: '',
            number: '',
        }
    },
    template: `
    <div>   
        <div>
            书名《{{book.name}}》
            数量：<span id="number">{{book.number}}</span>
        </div>
        <div>
            <button v-on:click="addone">加一</button>
            <button v-on:click="minusone">减一</button>
            <button v-on:click="clear">清空</button>
        </div>
    </div>
    `,//自己初始化html
    created(){
        model.fetch(1).then(()=>{//设置页面初始值
            this.book = model.data
        })
    },
    methods: {
        addone: function () {
            model.update(1, { number: this.book.number + 1 }).then(() => {
                this.book = model.data
            })
        },
        minusone: function () {
            model.update(1, { number: this.book.number - 1  }).then(() => {//这个数据先放到response.config.data里面，再更新原数据库
                this.book = model.data
            })
        },
        clear: function () {
            model.update(1,{number:0}).then(()=>{
                this.book = model.data
            })
        }
    }
})





/******************************************************************* */
//在真正返回response之前使用，模拟后端数据
function makedata() {
    let book = {
        'name': '沉默的咖啡壶',
        'number': 100
    }
    axios.interceptors.response.use(function (response) {
        var config = response.config
        let { method, url, data } = config
        if (url === '/books/1' && method === 'get') {
            response.data = book  //这个data是响应的数据
        } else if (url === '/books/1' && method === 'put') {
            Object.assign(book, data)  //这个data是请求的数据,先放到response.config.data里面，再赋值给book
            response.data = book
        }
        return response
    })
}