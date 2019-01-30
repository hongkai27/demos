let text = ``

writeCode(text)


/*................................ */
function writeCode(code) {
    let preCode = document.querySelector('#logo')
    let styleCode = document.querySelector('#styleCode')
    let n = 0
    let time = setInterval(() => { 
        n += 1
        styleCode.innerHTML = code.substring(0, n)
        preCode.innerHTML = Prism.highlight(code.substring(0, n), Prism.languages.css)
        preCode.scrollTop = preCode.scrollHeight
        if (n > code.length) {
            window.clearInterval(time)
            
        }
    },10)
}

