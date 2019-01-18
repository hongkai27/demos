封装AJAX
window.jQuery.ajax = function({url,method,body,haeaders}){
    return new Promise(function(resolve,reject){
        let request = new XMLHttpRequest
        request.open(method,url)
        for(let key in headers){
            let value = headers[key]
            request.setRequestheader(key,value)
        }
        request.send()
        request.onreadystatechange = ()=>{
            if(request.readyState === 4){
                if(request.status >=200 && request.status < 300){
                    resolve.call(undefined,request.responseText)
                }else if(request.status >= 400){
                    reject.call(undefined,request)
                }
            }
        }
    })
}


客户端添加事件
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