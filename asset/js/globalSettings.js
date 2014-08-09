/**
 * globalSettings.js Where global variables live.
 */
 
var globalSettings = {
    //urlBase is used in Sammy.js router to do default routing.
    //Must end with a "/" to match the default behavior of links to ihome.
    //e.g. http://ihome.ust.hk/~itsc will be rewritten as http://ihome.ust.hk/~itsc/ automatically.
    urlBase: "/~ysunai/",
    
    
    
    //apiBase The URL to backendAPI base
    apiBase: "http://dml085.resnet.ust.hk:49000/film/api/",
    
    loginUrl: 'http://dml085.resnet.ust.hk:49000/film/member/login/',
    logoutUrl: 'http://dml085.resnet.ust.hk:49000/film/member/logout/',
    
    resourceBase: 'http://ihome.ust.hk/~ysunai/asset/',
    scribdID: 'pub-51573345608846754358',
}