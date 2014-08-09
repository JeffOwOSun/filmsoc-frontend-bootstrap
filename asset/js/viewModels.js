/**
 * 
 * viewModels.js
 *
 */

//currentView stores the ViewModel object currently on display.
var currentView=null;

cr.define("routeManager", Sammy());

function SiteSettingsViewModel(){
    var self = this;
    self.loadSettings=function(){
        $.ajax(globalSettings.apiBase+"sitesettings/",{
            cache: false,
            type: "GET",
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data, textState, jqXHR){
        
        })
    }
}
var siteSettingsViewModel = new SiteSettingsViewModel();

cr.define("navBarViewModel",function()(){
    //saving this CONTEXT into a variable, so that ENCAPSULATION will work for any callback defined here.
    var self=this;
    
    //the changeable array for menu items. adding to this will 
    var menuItems=ko.observableArray();
    
    //Private function, nothing special :-b
    function _appendItem(item){
        menuItems.push(item);
    }
    
    //Public function. ViewModels call this function to add themselves onto the menu.
    function addItem(name,hashTag){
        _appendItem({
            hashTag: hashTag,
            name:name,
            isActive:ko.observable(false),
        });
    }
             
    //Public function. Click handler. Changes the hash according to the hashTag field of the corresponding menu item.
    //change of hashTag will automatically fire the routerManager
    function itemClick(clickedItem){
        if (!clickedItem.isActive()){
            location.hash=clickedItem.hashTag;
        }
    }
    
    //Public function. Changes the .active class for the selected hashTag.
    //Should be called by route handlers.
    //@param hashTagToBeLoaded {string} hashTag to activate.
    function activateItem(hashTagToBeLoaded){
        ko.utils.arrayForEach(menuItems(),function(item){
            if (item.hashTag==hashTagToBeLoaded){
                //set .active to the corresponding item
                item.isActive(true);
            } else {
                //remove all .active class of other items
                item.isActive(false);
            }
        })
    }
    
    return{
        menuItems: menuItems,
        addItem: addItem,
        itemClick: itemClick,
        activateItem: activateItem,
    }
}
ko.applyBindings(cr.navBarViewModel, $('#navBar')[0]);

//userPanelViewModel
cr.define("userPanelViewModel",function(){
    var self=this;
    var buttonText=ko.observable("Log in");
    var user=ko.mapping.fromJS({
        full_name:"Guest",
        admin:false,
    });
    
    function buttonClick(){
        switch (buttonText()){
            case "Log out":
                //do logout stuff;
                //initialize redirection to the logout url
                var next = location.hash.substr(1),
                    url = globalSettings.logoutUrl + (next ? '?next=' + next : '');
                //Do the jump
                location.href = url;
                //when success, next time initialization checks user information 
                //ATTENTION: no callback needed here.
                break;
            case "Log in":
                //do login stuff;
                //initialize redirection to the login url
                var next = location.hash.substr(1),
                url = globalSettings.loginUrl + (next ? '?next=' + next : ''),
                redirect = 'https://cas.ust.hk/cas/login?service=' + encodeURIComponent(url);
                //Do the jump
                location.href = redirect;
                //when success, next time initialization checks user information 
                //ATTENTION: no callback needed here.
                break;            
            }
        }
    function adminLinkClick() {
      window.open('admin/');
    });
    function fetchUserInfo(){
        //fetch from backend server the user information.
        var r = new cr.APIRequest(cr.model.User, 'GET', '/current_user/', true);
           
        r.onload = function(ev) {
            var user = {};            
            cr.define("cr", function() { return {user: user}; });
            
            
            cr.ui.showNotification(ev.recObj.full_name + ', Welcome back!', 'dismiss');
            
            cr.model.SiteSettings.loadSettings(function() {
              cr.dispatchSimpleEvent(window, 'authload', false, false);
            });
          };
          
          r.onerror = function(ev) {
            if (ev.recObj.errno === 2) {
              //Not logged in
              //Hook Guest panel
              buttonText("Log in");
                
              data.full_name="Guest";
              //Always fetch SiteSettings
              cr.model.SiteSettings.loadSettings(function() {
                cr.dispatchSimpleEvent(window, 'authload', false, false);
              });
            }
            else {
              //Give it to error handler
              errorHandler(ev);
            }
          };
          r.send();
        })
        
    function initialize(){
        //check login status.
        fetchUserInfo();  
        
    }    
        
    return{
        initialize: initialize;
    }
});
ko.applyBindings(cr.userPanelViewModel, $("#userPanel")[0]);
userPanelViewModel.initialize();

//these will later be distributed into views
/*
navBarViewModel.addItem("Home","#!home");
navBarViewModel.addItem("Free Film Tickets","#!ticket");
navBarViewModel.addItem("Regular Film Show","#!show");
navBarViewModel.addItem("Documents","#!document");
navBarViewModel.addItem("Publications","#!publication");
*/

//ViewModel for home.
cr.define('cr.view.home', function() {
    var name = 'news';
    var navBarTitle = 'Home';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    //You can bind to cr.view.home.pager.itemList
    var pager = new cr.Pager(cr.model.News, '/?limit=10');
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
    cr.routeManager.get('#!home',function(){
        location.hash = '#!home/1/';
    });
    
    cr.routeManager.get('#!home/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            if(cr.view.current != cr.view.home){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.home;
                cr.view.current.show();
            }
        });
    });
    
    return {
        itemArray: itemArray,
    }
});
ko.applyBindings(cr.view.home, $("homeView")[0]);

//ViewModel for DVD/VCD Library.





