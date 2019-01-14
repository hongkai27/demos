/*
$(clickme2).on('click', function () {
    $(pop2).show()
    setTimeout((function(){
        $(document).one('click', function () {
            $(pop2).hide()
        })
    }),0)
})
*/




$(clickme2).on('click', function () {
    $(pop2).toggle()         /* toggle相当于一个开关，可以切换状态*/
        $(document).one('click', function () {
            $(pop2).hide()
        })
})
$(wrapper2).on('click', function (e) {
    e.stopPropagation() 
})

