//用VUE做一个浮层案例
let view = new Vue({
    el:'#xxx',
    data:{
      open:false
    },
    template:`
      <div>               
          <button v-on:click="toggle">点我</button>  
          <div v-if="open">我又出来啦</div>
      </div>
    `,
    methods:{
      toggle(){
        this.open = !this.open  //取反
      }
    }
  })