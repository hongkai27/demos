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
    template: ` 
        <div>
            书名《__bookname__》
            数量：<span id="number">{{number}}</span>
        </div>
        <div>
            <button id="addone">加一</button>
            <button id="minusone">减一</button>
            <button id="clear">清空</button>
        </div>
    `,//自己初始化html
    render(data) {
        let html = this.template.replace('__bookname__', data.name)
            .replace('__number__', data.number)
        $(this.el).html(html)
    }
})

let controler = {
    init(options) {
        let { view, model } = options
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEvents()
        this.model.fetch(1)  //路径为/books/1
            .then((response) => {
                let data = response.data
                view.render(data) //重置内容,data也可以用model.data表示,值是一样的
            })
    },
    bindEvents() {
        $(this.view.el).on('click', '#addone', function () {
            var oldnumber = $('#number').text()
            var newnumber = oldnumber - 0 + 1
            model.update(1, { number: newnumber }).then(() => {
                $('#number').text(newnumber)//新数据放入book更新之后，再在html中显示
            })
        })
        $(this.view.el).on('click', '#minusone', function () {
            var oldnumber = $('#number').text()
            var newnumber = oldnumber - 0 - 1
            model.update(1, { number: newnumber }).then(() => {//这个数据先放到response.config.data里面，再更新原数据库
                $('#number').text(newnumber)
            })
        })
        $(this.view.el).on('click', '#clear', function () {
            $('#number').text(0)
        })
    }
}

controler.init({ view: view, model: model })



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