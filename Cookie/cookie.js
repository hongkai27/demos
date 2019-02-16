let hash = {}
$('#form').on('submit',(e)=>{  //表单元素被提交时
    e.preventDefault() //阻止自己提交动作
    let need = ['email','password','password_confirmation'] //把需要的元素名称做成一个数组
    need.forEach((name)=>{ //forEach的参数是一个函数，函数接收三个参数，1、当前位置的值 2、当前位置 3、数组
        let value = $('#form').find(`[name=${name}]`).val() //找到name对应的元素内用户输入的内容
        hash[name] = value
    })
})