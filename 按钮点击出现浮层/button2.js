/*
$(clickme2).on('click', function () {
    $(pop2).show()
    console.log('1')
    setTimeout((function () {
        console.log('2')
        $(document).one('click', function () {
            $(pop2).hide()
            console.log('3')
        })
        $(document).one('mousemove', function () {
            let a = document.createElement('a')
            a.innerHTML = 'baidu'
            wrapper2.appendChild(a)
            console.log('4')
        })
        console.log('5')
    }), 0)
})
*/



$(clickme2).on('click', function () {
    $(pop2).toggle()
        $(document).one('click', function () {
            $(pop2).hide()
        })
})
$(wrapper2).on('click', function (e) {
    e.stopPropagation()
})

