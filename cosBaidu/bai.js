text.oninput = function () {
    var value = text.value
    if (value) {
        suggestion.classList.add('active')
    }else{
        suggestion.classList.remove('active')
    }
}