angular.module('rssReader', ['ngRoute','ngResource'])
.run(function(){
})
.config(function($routeProvider, $sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://api.rss2json.com/v1/api.json'
  ]);

  $routeProvider
    .when('/',                      {templateUrl:'list/list.html',         controller:'itemsCtrl as itemsCtrl',})
    .when('/feed/:id',              {templateUrl: 'list/list.html',        controller: 'itemsCtrl as itemsCtrl'})
    .when('/feed/:id/item/:hashKey',{templateUrl: 'item/item.html',        controller: 'itemCtrl as itemCtrl'})
    .when('/manage',                {templateUrl: 'manage/manage.html',      controller: 'manageCtrl as manageCtrl'})
    .when('/manage/add',            {templateUrl: 'manage/add.html',       controller: 'manageCtrl as manageCtrl'})
})
.filter('hash',function(HashString){
  return function (value) {
            return HashString.perform(value);
  };
})
.filter('rssDate',function(){
  return function (value) {
    return new Date(value).toLocaleString();
  };
})
