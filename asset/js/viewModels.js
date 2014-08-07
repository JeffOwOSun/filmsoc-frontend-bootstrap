/**
 * 
 * viewModels.js
 *
 */
var currentView=null;

function NavBarViewModel(){
    //saving this CONTEXT into a variable, so that ENCAPSULATION will work for any callback defined here.
    var self=this;
    
    //the changeable array for menu items. adding to this will 
    self.menuItems=ko.observableArray();
    
    //Private function, nothing special :-b
    self._appendItem=function(item){
        self.menuItems.push(item);
    }
    
    //Public function. ViewModels call this function to add themselves onto the menu.
    self.addItem=function(name,hashTag){
        self._appendItem({
            hashTag: hashTag,
            name:name,
            isActive:ko.observable(false),
        });
    }
             
    //Public function. Click handler. Changes the hash according to the hashTag field of the corresponding menu item.
    //change of hashTag will automatically fire the routerManager
    self.itemClick=function(clickedItem){
        if (!clickedItem.isActive()){
            location.hash=clickedItem.hashTag;
        }
    }
    
    //Private function. Changes the .active class for the selected hashTag.
    //Should be called by itemClick.
    //@param hashTagToBeLoaded {string} hashTag to activate.
    self.activateItem=function(hashTagToBeLoaded){
        ko.utils.arrayForEach(self.menuItems(),function(item){
            if (item.hashTag==hashTagToBeLoaded){
                //set .active to the corresponding item
                item.isActive(true);
            } else {
                //remove all .active class of other items
                item.isActive(false);
            }
        })
    }
    
}
var navBarViewModel = new NavBarViewModel()
ko.applyBindings(navBarViewModel, $('#navBar')[0]);


//userPanelViewModel
function UserPanelViewModel(){
    var self=this;
    
}
var userPanelViewModel = new UserPanelViewModel();
userPanelViewModel.initialize();
ko.applyBindings(userPanelViewModel, $("#userPanel")[0]);

//these will later be distributed into views
/*
navBarViewModel.addItem("Home","#!home");
navBarViewModel.addItem("Free Film Tickets","#!ticket");
navBarViewModel.addItem("Regular Film Show","#!show");
navBarViewModel.addItem("Documents","#!document");
navBarViewModel.addItem("Publications","#!publication");
*/

//ViewModel for home.
function HomeViewModel(){
    var self=this;
    
    self.name="Home";
    self.hashTag="#!home";
    self.isHidden=ko.observable(true);    
    self.show=function(){
        self.isHidden(false);
    }
    self.hide=function(){
        self.isHidden(true);
    }
    self.initialize=function(){
        navBarViewModel.addItem(self.name,self.hashTag);
        //register Sammy.js hash handler
        //root hash for this view.
        routeManager.get("#!home", function() {
            navBarViewModel.activateItem(location.hash);
            
            if (currentView) {
                currentView.hide();
            }
            currentView=self;
            currentView.show();
        })
    }
}
var homeViewModel = new HomeViewModel();
homeViewModel.initialize();
ko.applyBindings(homeViewModel, $("#homeView")[0]);

//ViewModel for DVD/VCD Library.
function LibaViewModel(){
    var self=this;
    self.name="DVD/VCD Library";
    self.hashTag="#!liba";
    self.isHidden=ko.observable(true);
    self.show=function(){
        self.isHidden(false);
    }
    self.hide=function(){
        self.isHidden(true);
    }
    self.initialize=function(){
        navBarViewModel.addItem(self.name,self.hashTag);
        //register Sammy.js hash handler
        //root hash for this view.
        routeManager.get("#!liba", function() {
            navBarViewModel.activateItem(location.hash);
            
            if (currentView) {
                currentView.hide();
            }
            currentView=self;
            currentView.show();
        })
    }
}
var libaViewModel = new LibaViewModel();
libaViewModel.initialize();
ko.applyBindings(libaViewModel, $("#libaView")[0]);


