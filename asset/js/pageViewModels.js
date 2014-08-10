/**
 * 
 * pageViewModels.js
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

cr.define("cr.view.nav",function()(){
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

//ViewModel for home.
cr.define('cr.view.home', function() {
    var name = 'news';
    var navBarTitle = 'Home';
    var hashTag = '#!home';
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
    
    
    cr.routeManager.get(hashTag,function(){
        location.hash = hashTag+'/1/';
    });
    
    cr.routeManager.get(hashTag+'/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            cr.view.nav.activateItem(hashTag);
            if(cr.view.current != cr.view.home){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.home;
                cr.view.current.show();
            }
        });
    });
    
    cr.view.nav.addItem(navBarTitle, hashTag);
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        pager: pager,
        show: show,
        hide: hide,
    }
});

//ViewModel for DVD/VCD Library.
cr.define("cr.view.liba",function(){
    var name = 'news';
    var navBarTitle = 'DVD/VCD Library';
    var hashTag = '#!liba';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    var pager = new cr.Pager(cr.model.Disk, '/?limit=12');
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
    cr.routeManager.get(hashTag,function(){
        location.hash = hashTag+'/1/';
    });
    
    cr.routeManager.get(hashTag+'/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            cr.view.nav.activateItem(hashTag);
            if(cr.view.current != cr.view.liba){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.liba;
                cr.view.current.show();
            }
        });
    });
    
    cr.view.nav.addItem(navBarTitle, hashTag);
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        pager: pager,
        show: show,
        hide: hide,
    }
});

cr.define("cr.view.fft",function(){
    var name = 'ticket'; 
    var navBarTitle = 'Free Film Tickets';
    var hashTag = '#!fft';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    var pager = new cr.Pager(cr.model.FreeFilmTicket, '/?limit=10');
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
    cr.routeManager.get(hashTag,function(){
        location.hash = hashTag+'/1/';
    });
    
    cr.routeManager.get(hashTag+'/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            cr.view.nav.activateItem(hashTag);
            if(cr.view.current != cr.view.fft){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.fft;
                cr.view.current.show();
            }
        });
    });
    
    cr.view.nav.addItem(navBarTitle, hashTag);
    
    return {
        itemArray: itemArray,
        isHidden: isHidden,
        pager: pager,
        show: show,
        hide: hide,
    }
});

cr.define("cr.view.sponsors",function(){
    var name = 'sponsors'; 
    var navBarTitle = 'Free Film Tickets';
    var hashTag = '#!sponsors';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    var pager = new cr.Pager(cr.model.Sponsor, '/?limit=10');
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
    cr.routeManager.get(hashTag,function(){
        location.hash = hashTag+'/1/';
    });
    
    cr.routeManager.get(hashTag+'/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            cr.view.nav.activateItem(hashTag);
            if(cr.view.current != cr.view.sponsors){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.sponsors;
                cr.view.current.show();
            }
        });
    });
    
    cr.view.nav.addItem(navBarTitle, hashTag);
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        pager: pager,
        show: show,
        hide: hide,
    }
});

cr.define("cr.view.aboutUs",function(){
    var name = 'aboutUs'; 
    var navBarTitle = 'About Us';
    var hashTag = '#!aboutus';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    var pager = new cr.Pager(cr.model.Exco, '/?limit=20');
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
    cr.routeManager.get(hashTag,function(){
        location.hash = hashTag+'/1/';
    });
    
    cr.routeManager.get(hashTag+'/:page/',function(){
        pager.loadPage(page,function(){
            //after loading success
            cr.view.nav.activateItem(hashTag);
            if(cr.view.current != cr.view.aboutUs){
                if(cr.view.current){
                    cr.view.current.hide();
                }
                cr.view.current = cr.view.aboutUs;
                cr.view.current.show();
            }
        });
    });
    
    cr.view.nav.addItem(navBarTitle, hashTag);
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        pager: pager,
        show: show,
        hide: hide,
    }
});

ko.applyBindings(cr.navBarViewModel, $('#navBar')[0]);
ko.applyBindings(cr.userPanelViewModel, $("#userPanel")[0]);
userPanelViewModel.initialize();
ko.applyBindings(cr.view.home, $("#homeView")[0]);
ko.applyBindings(cr.view.liba, $("#libaView")[0]);
ko.applyBindings(cr.view.fft, $("#fftView")[0]);
ko.applyBindings(cr.view.sponsors, $("#sponsorsView")[0]);
ko.applyBindings(cr.view.aboutUs, $("#aboutUsView")[0]);

