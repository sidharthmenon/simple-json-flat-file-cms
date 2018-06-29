/*
Author: Sidharth Menon
Website: http://sidharthmenon.com
 */
const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

Vue.component('menu-item', {
  props: ['parent', 'contents'],
  data: function () {
    return {
      isactive: [ true, true],
    }
  },
  template: `<ul :class="menuClass">
              <li v-for="item in pages">
                <a @click="$bus.$emit('menu-click', item.id)" 
                    :class="{'is-active':isactive[item.id]}">
                  {{item.display}}
                </a>
                <menu-item v-if="item.hasChild" :parent="item.id" :contents="contents"></menu-item>
              </li>
            </ul>`,
  computed:{
    menuClass: function(){
      if(this.parent == 0){
        return "menu-list";
      }
    },
    pages: function(){
      //console.log(this.parent);
      return this.contents.filter(function(item){
        //console.log(item.display+ " - " + item.id + " - " +item.parent);
        return item.parent == this.parent
      }.bind(this))
    },
  },

  methods:{
    
  },

  mounted(){
    this.$bus.$on('change-active', function(data){
      this.isactive = [];
      this.isactive[data] = true; 
    }.bind(this));
  }

})

var app = new Vue({
  el: '#app',
  data: {
    menuTitle: 'Pages',
    sel_id : 1,
    selected : 0,
    contents : [
      {
        "id": "1",
        "display": "Page",
        "parent": "0",
        "hasChild": false,
        "hasContent": true,
        "content": "#Page",
        "order": "1",
        "icon": "1"
      }
    ],
    fileName: '',
    launchModal: false,
    config: {
      title: "Sample JSON Flat File CMS",
      home: "0"
    },
    newkey: '',
  },
  methods:{
    getIndex: function(id){
      return this.contents.findIndex(function(item){
        return item.id == id
      })
    },
    parentDash: function(id){
      var index = this.getIndex(id);
      if(this.contents[index].parent == "0"){
        return "";
      }
      else{
        return "-" + this.parentDash(this.contents[index].parent);
      }
    },
    refreshMenu: function(id){
      this.$bus.$emit('change-active', id);
      this.$nextTick(() => mdedit.refreshPreview());
    },
    newPage: function(){
      var new_id = parseInt(this.contents[this.contents.length-1].id) + 1
      var new_item = {
        "id": new_id,
        "display": "New Page",
        "parent": "0",
        "hasChild": false,
        "hasContent": false,
        "content": "#New Page",
        "order": "0",
        "icon": "0"
      };
      this.contents.push(new_item);
      this.sel_id=new_id;
      this.selected = this.contents.length;

    },
    deletePage: function () {
      this.contents = this.contents.map(function(item){
        if(item.parent == this.sel_id){
          item.parent = "0";
        }
        return item;
      }.bind(this))
      var del_sel = this.selected;
      this.selected = 0;
      this.sel_id = this.contents[0].id;
      this.contents.splice(del_sel, 1);
      this.refreshMenu(this.sel_id);
    },
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
    handleFile: function(){
      var tmppath = URL.createObjectURL(this.$refs.file.files[0]);
      this.fileName = this.$refs.file.files[0].name;
      this.readTextFile(tmppath, function(data){
        var json = JSON.parse(data);
        this.contents= json.content;
        this.config= json.config;
        this.refreshMenu();
      }.bind(this))
    },
    download: function(content, fileName, contentType){
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
    saveFile: function(){
      var jsonData = JSON.stringify({"content" : this.contents, "config": this.config}, null, 2);
      this.download(jsonData, this.fileName, 'application/json');
    },
    deleteConfig: function (key) {
      this.config[key] = undefined;
      delete this.config[key];
      console.log(key);
    },
    addKey: function () {
      this.$set(this.config, this.newkey, "Enter Value");
      this.newkey = '';
    },
  },
  computed:{
    content:{
      get: function(){
        return this.contents[this.selected];
      },
      set: function(newVal){
        this.contents[this.selected] = newVal;
      }
    },
    optionDisplay: function(){
      return this.contents.filter(function(item){
        return item.id != this.sel_id;
      }.bind(this)).map(function(item){
        item.option = this.parentDash(item.id) + item.display;
        //item.option = item.display;
        return item;
      }.bind(this))
    },
  },
  mounted(){
    this.$bus.$on('menu-click', function(data){
      this.selected = this.getIndex(data);
      this.sel_id = data;
      this.refreshMenu(data);
    }.bind(this));
  },
  
})