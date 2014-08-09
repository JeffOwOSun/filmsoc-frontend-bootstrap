/**
 * routeManager.js
 */
 
 // Client-side routes    
var routeManager = Sammy(function() {
    this.get("/~ysunai/", function(){
        location.hash="#!home";
    });
});

routerManager.pushState(hash){
    location.hash = hash;
}
$(document).on("ready",function(){
    routeManager.run();
});