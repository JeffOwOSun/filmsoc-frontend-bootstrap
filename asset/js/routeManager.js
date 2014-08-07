/**
 * routeManager.js
 */
 
 // Client-side routes    
var routeManager = Sammy(function() {
    this.get("/~ysunai/", function(){
        location.hash="#!home";
    });
});

$(document).on("ready",function(){
    routeManager.run();
});