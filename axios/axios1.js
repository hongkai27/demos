let book = {
    'name': '沉默的咖啡壶',
    'number': 100
}
axios.interceptors.response.use(function (response) {
    var config = response.config
    let { method, url, data } = config
    if (url === '/books/1' && method === 'get') {
        response.data = book
    } else if (url === '/books/1' && method === 'put') {
        Object.assign(book, data)
    }
    return response
})
//上面是后端代码，可以理解
axios.get('/books/1')  //每一次操作都会自动执行get函数，路径为/books/1
    .then((response) => {
        let data = response.data  //函数参数应该是继承的，暂时还不懂
        let originalhtml = $('#app').html()
        let newhtml = originalhtml.replace('__bookname__', data.name) //用替换符更改内容
            .replace('__number__', data.number)
        $('#app').html(newhtml) //重置内容
    })

$('#app').on('click', '#addone', function () {
    var oldnumber = $('#number').text()
    var newnumber = oldnumber - 0 + 1
    axios.put('/books/1', {
        number: newnumber
    }).then(() => {
        $('#number').text(newnumber)//新数据放入book更新之后，再在html中显示
    })
})
$('#app').on('click', '#minusone', function () {
    var oldnumber = $('#number').text()
    var newnumber = oldnumber - 0 - 1
    axios.put('/books/1', {
        number: newnumber
    }).then(() => {
        $('#number').text(newnumber)
    })
})
$('#app').on('click', '#clear', function () {
    $('#number').text(0)
})