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

angular.module('rssReader')
.controller('FeedListCtrl',function($scope, $routeParams, FeedList, FeedLoad){
  $scope.feeds = FeedList.get();

  $scope.$on('FeedList', function (event, data) {
      $scope.feeds = data;
  });
})

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

angular.module('rssReader')
.controller('itemCtrl',function($scope, $routeParams, FeedList, FeedLoad, HashString){
  var feed = FeedList.getById($routeParams.id)

  FeedLoad.getFeed({rss_url: feed.url, num: 50}, function (data) {
    console.log(data);
    $scope.feed = data.feed;
    $scope.id = $routeParams.id;
    var entries = data.items;

    for (var i = entries.length - 1; i >= 0; i--) {
        if (HashString.perform(entries[i].title) == $routeParams.hashKey) {
            $scope.item = entries[i];
        }
    }
  });
})

angular.module('rssReader')
    .controller('itemsCtrl', function ($scope, $routeParams, FeedList, FeedLoad) {
        var feed = FeedList.getById($routeParams.id || FeedList.getMinId())

        FeedLoad.getFeed({rss_url: feed.url, num: 50}, function (data) {
          console.log(data);
            $scope.feed = data.items;
            $scope.feed.id = feed.id;
        });
    });

angular.module('rssReader')
.service('FeedList', function ($rootScope, LocalObjectStorage){
  this.get=function(){
    if(LocalObjectStorage.contains('FeedList')){
      return LocalObjectStorage.getObject('FeedList');
    }
    return [{
      url: 'http://cacodaemon.de/index.php?rss=1',
      title: 'Cacomania',
      id: 0
    }]
  }
  this.add=function(url, title){
    var list = this.get();
    var id = localStorage.getItem('FeedListId') ? localStorage.getItem('FeedListId') : 1;

    list.push({
      url:url,
      title:title,
      id:id
    });

    LocalObjectStorage.setObject('FeedList',  list);
    localStorage.setItem('FeedListId', ++id);
    $rootScope.$broadcast('FeedList', list);
  }

  this.delete=function(id){
    var list = this.get;
    for(var i=0; i< list.length;i++){
      if(list[i].id == id){
        list.splice(i,1)
      }
    }
    LocalObjectStorage.setObject('FeedList', list);
    $rootScope.$broadcast('FeedList', list);
  }

  this.getById=function(id){
    var list = this.get();
    for( var i =0; i<list.length ; i++){
      if(list[i].id == id){
        return list[i];
      }
    }
    return null;
  }

  this.getMinId = function () {
    var list = this.get();
    var minId = Number.MAX_VALUE;

    for (var i = list.length - 1; i >= 0; i--) {
        minId = Math.min(minId, list[i].id);
    }

    return minId;
  };
})

angular.module('rssReader')
.factory('FeedLoad',function($resource, $sce){
  return $resource('https://api.rss2json.com/v1/api.json',
                  { },
                  { getFeed: { method: 'JSONP' , params:{} }   })
})

angular.module('rssReader')
.controller('listCtrl',function($scope, $routeParams, FeedList, FeedLoad){
  console.log('list ctrl');
  $scope.feeds = FeedList.get();

  var feed = FeedList.getById($routeParams.id || FeedList.getMinId());

  FeedLoad.getFeed({rss_url: feed.url, num: 10 },function(data){
    console.log(data);
    $scope.feed = data.feed;
    $scope.feed.id = feed.id;
  });
})

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

angular.module('rssReader')
.controller('manageCtrl',function($scope, $location, FeedLoad, FeedList){
  $scope.feeds = FeedList.get();

  $scope.add = function () {
    FeedList.add($scope.feed.url, $scope.feed.title);
    $location.path('/manage');
  };

  $scope.delete = function (id) {
      FeedList.delete(id);
  };
  $scope.$on('FeedList', function (event, data) {
    console.log('feed event');
    $scope.feeds = data;
  });

})
