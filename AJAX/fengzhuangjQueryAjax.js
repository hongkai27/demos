window.jQuery.ajax = function ({ url, method, body, headers }) {
    let request = new XMLHttpRequest
    request.open(method, url)
    for (let key in headers) {
        let value = headers[key]
        request.setRequestheader(key, value)
    }
    request.send()
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300) {
                successFn.call(undefined, request.responseText)
            } else if (request.status >= 400) {
                failFn.call(undefined, request)
            }
        }
    }
}


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
