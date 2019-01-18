封装AJAX
window.jQuery.ajax = function({url,method,body,haeaders}){
    return new Promise(function(resolve,reject){   //固定套路，背下来
        let request = new XMLHttpRequest    //1、新建需求对象
        request.open(method,url)  //2、配置request，设置和服务器交互的信息
        for(let key in headers){  //3、需要设置header的话加上
            let value = headers[key]
            request.setRequestheader(key,value)
        }
        request.send()  //4、发送请求
        request.onreadystatechange = ()=>{//解析响应信息
            if(request.readyState === 4){//步骤执行结束
                if(request.status >=200 && request.status < 300){//判断状态码
                    resolve.call(undefined,request.responseText)//成功函数
                }else if(request.status >= 400){
                    reject.call(undefined,request)//失败函数
                }
            }
        }
    })
}


客户端添加事件
/*简化版 */
Button.addEventListener('click', () => {
    let obj = {
        url: '/xxx',
        method: 'get',
        headers: {
            'content-type': 'html/javascript',
            'ccc': 'bbb'
        },
        window,jQuery,ajax(obj)
})

/*精装版 */
Button.addEventListener('click',()=>{
    let promise = window.jQuery.ajax({
        url:'/xxx',
        method:'get',
        headers:{
            'content-type':'html/javascript',
            'ccc':'bbb'
        }
    }).then(
        (/*request.responseText*/text)=>{console.log(text)},
        (request)=>{console.log(request)}
    )
})