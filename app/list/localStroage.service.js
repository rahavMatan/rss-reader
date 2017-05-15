angular.module('rssReader')
.service('LocalObjectStorage',function(){
  this.setObject=function(key,value){
    localStorage.setItem(key, JSON.stringify(value));
  }
  this.getItem = function(key){
    return JSON.parse(localStorage.getItem(key));
  }
  this.removeObject = function (key) {
    localStorage.removeItem(key);
  };
  this.contains = function (key) {
    return localStorage.getItem(key) ? true : false;
  };
})
