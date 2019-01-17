/*
1、如何发请求：

用 form 可以发请求，但是会刷新页面或新开页面
用 a 可以发 get 请求，但是也会刷新页面或新开页面
用 img 可以发 get 请求，但是只能以图片的形式展示
用 link 可以发 get 请求，但是只能以 CSS、favicon 的形式展示
用 script 可以发 get 请求，但是只能以脚本的形式运行



2、Jesse James Garrett 将如下技术取名叫做 AJAX：

（异步的 JavaScript 和 XML）
  使用 XMLHttpRequest 发请求
  服务器返回 XML 格式的字符串
  JS 解析 XML，并更新局部页面



3、如何使用XMLHttpRequest:

//前端代码
  myButton.addEventListener('click', (e)=>{
    let request/可以是任何名称 = new XMLHttpRequest()/创建对象
    request.open('get', '/xxx') / 配置request，设置和服务器交互的信息
    request.send()/发送请求，开始和服务器交互
    request.onreadystatechange = ()=>{
      if(request.readyState === 4){
        console.log('请求响应都完毕了')
        console.log(request.status)
        if(request.status >= 200 && request.status < 300){
          console.log('说明请求成功')
          console.log(typeof request.responseText)/responseText就是后端JS里面的response.write
          console.log(request.responseText)

          let string = request.responseText
          // 把符合 JSON 语法的字符串
          // 转换成 JS 对应的值
          let object = window.JSON.parse(string)
          // JSON.parse 是浏览器提供的

          console.log(typeof object)
          console.log(object)
          console.log('object.note')
          console.log(object.note)
        }else if(request.status >= 400){
          console.log('说明请求失败')
        }

      }
    }
  })


  // 后端代码
  }else if(path==='/xxx'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://frank.com:8001')
    response.write(`
    {
      "note":{
        "to": "小谷",
        "from": "方方",
        "heading": "打招呼",
        "content": "hi"
      }
    }
    `)
    response.end()

4、JSON同源策略
只有 协议+端口+域名 一模一样才允许发 AJAX 请求
浏览器必须保证
只有 协议+端口+域名 一模一样才允许发 AJAX 请求
CORS 可以告诉浏览器，我俩一家的，别阻止他
Cross/跨-Origin/源 Resource/资源 Sharing/共享