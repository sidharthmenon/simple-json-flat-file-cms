Vue.use(VueMarkdown);
const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

Vue.component('menu-item', {
	props: ['parent', 'contents', 'menuclass'],
	data () {
	  return {
	    
	  };
	},
	template:`
		<ul :class="menuclass">
		  <li v-for="item in pages" 
		  	:class="{'dropdown-submenu': (item.hasChild && item.parent != 0)}">
		    <a v-if="!item.hasChild" href="#" @click="$bus.$emit('menu-click', item.id)">
		    	{{item.display}}
		    </a>
		    <a v-if="item.hasChild" href="#" class="dropdown-toggle" data-toggle="dropdown">
		    	{{item.display}} <b class="caret"></b>
		    </a>
		    <menu-item v-if="item.hasChild" :menuclass="nextClass" :parent="item.id" :contents="contents"></menu-item>
		  </li>
		</ul>`,
	computed: {
		nextClass: function(){
      if(this.parent == 0){
        return "dropdown-menu multi-level";
      }
      else{
      	return "dropdown-menu"
      }
		},
		pages: function(){
      return this.contents.filter(function(item){
      	//item.parentCount = this.parentCount(item.id);
        return item.parent == this.parent
      }.bind(this))
    },
	},
	methods: {

	},

});

var app = new Vue({
	el: "#app",
	data: {
		config: {
			title: "Sample JSON Flat File CMS",
			home: "0"
		},
		contents: [],
		source: '> loading',
	},
	methods:{
		readTextFile: function(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
              callback(rawFile.responseText);
          }
      }
      rawFile.send(null);
    },
    getIndex: function(id){
      return this.contents.findIndex(function(item){
        return item.id == id
      })
    },
	},
	mounted(){
		this.readTextFile("data.json", function(data){
			var json = JSON.parse(data)
    this.contents= json.content;
    this.config= json.config;
    this.source = this.contents[this.config.home].content;
    document.title=this.config.title;
  }.bind(this))

  this.$bus.$on('menu-click', function(data){
  	var index = this.getIndex(data);
  	this.source = this.contents[index].content;
  }.bind(this));
	},

})