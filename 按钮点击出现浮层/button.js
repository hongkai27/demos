clickme1.addEventListener('click',function(){
    pop1.style.display = 'block'
})
wrapper1.addEventListener('click',function(e){
    e.stopPropagation()
})
document.addEventListener('click',function(){
    pop1.style.display = 'none'
})
