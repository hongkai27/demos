/*
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
  })*/
  /***************************** */
  /*
  //用VUE做一个tab切换
  let view = new Vue({
    el: '#app',
    data:{
      selected: 'a',
      tabs: [
        {name: 'a', content: 'aaa'},
        {name: 'b', content: 'bbb'},
        {name: 'c', content: 'ccc'},
      ]
    },
    template:`
  <div>
      <ol>
        <li v-for="tab in tabs"
          v-on:click="selected = tab.name"
          v-bind:class="{active: tab.name === selected}"
        >{{ tab.name }}</li>
      </ol>
      <ol>
        <li v-for="tab in tabs"
          v-show="selected === tab.name"
        >{{ tab.content }}</li>
        
      </ol>
  </div>
    `,
    methods: {
      
    }
  })*/
    /***************************** */
    /*
  {
    let view = new Vue({
      el: '#example-3',
      data: {
        checkedNames: []
      }
    })
    let controller = {
      init(view){
        this.view = view
      }
    }
    controller.init(view)
  }*/
  {
    let view = new Vue({
      el: '#example-4',
      data: {
        picked: '',
        message:'',
        checked :''
      }
    })
    let controller = {
      init(view){
        this.view = view
      }
    }
    controller.init(view)
  }
  
  