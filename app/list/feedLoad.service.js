angular.module('rssReader')
.factory('FeedLoad',function($resource, $sce){
  return $resource('https://api.rss2json.com/v1/api.json',
                  { },
                  { getFeed: { method: 'JSONP' , params:{} }   })
})
