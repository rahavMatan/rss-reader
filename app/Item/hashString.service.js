angular.module('rssReader')
.service('HashString',function(){
  this.perform=function(str){
    var hash=0;
    if(!str.length){
      return hash;
    }
    for(var i=0;i<str.length;i++){
      var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash= hash & hash;
    }
    return hash;
  }
})
