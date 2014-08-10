/**
 * modalViewModel.js
 */

cr.define("cr.modal.news",function(){
    var name = 'news'; 
    var title = 'News';
    var hashTag = '#!news';
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    var pageNav = ko.observableArray();
    
    var model = cr.model.News;
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
    
    
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id,function(){
            //after loading success
            if(cr.modal.current != cr.modal.news){
                if(cr.modal.current){
                    cr.modal.current.hide();
                }
                cr.modal.current = cr.modal.news;
                cr.modal.current.show();
            }
            $('myModal').modal('show');
        });
        
        //todo: toggle loading
    });
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        model: model,
        show: show,
        hide: hide,
    }
});

cr.define("cr.modal.disk",function(){
    var name = 'disk'; 
    var title = 'Disk';
    var hashTag = '#!disk';
    var model = cr.model.Disk;
    
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id,function(){
            //after loading success
            if(cr.modal.current != cr.modal[name]){
                if(cr.modal.current){
                    cr.modal.current.hide();
                }
                cr.modal.current = cr.modal[name];
                cr.modal.current.show();
            }
            $('myModal').modal('show');
        });
        
        //todo: toggle loading
    });
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        model: model,
        show: show,
        hide: hide,
    }
});

cr.define("cr.modal.ticket",function(){
    var name = 'ticket'; 
    var title = 'Preview Show Ticket';
    var hashTag = '#!ticket';
    var model = cr.model.PreviewShowTicket;
    
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id,function(){
            //after loading success
            if(cr.modal.current != cr.modal[name]){
                if(cr.modal.current){
                    cr.modal.current.hide();
                }
                cr.modal.current = cr.modal[name];
                cr.modal.current.show();
            }
            $('myModal').modal('show');
        });
        
        //todo: toggle loading
    });
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        model: model,
        show: show,
        hide: hide,
    }
});

cr.define("cr.modal.sponsor",function(){
    var name = 'sponsor'; 
    var title = 'Sponsor';
    var hashTag = '#!sponsor';
    var model = cr.model.Sponsor;
    
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id,function(){
            //after loading success
            if(cr.modal.current != cr.modal[name]){
                if(cr.modal.current){
                    cr.modal.current.hide();
                }
                cr.modal.current = cr.modal[name];
                cr.modal.current.show();
            }
            $('myModal').modal('show');
        });
        
        //todo: toggle loading
    });
    
    return {
        itemArray: itemArray,
        isHidden:isHidden,
        model: model,
        show: show,
        hide: hide,
    }
});

cr.define("cr.modal.exco",function(){
    var name = 'exco'; 
    var title = 'Exco';
    var hashTag = '#!exco';
    var model = cr.model.Exco;
    
    var isHidden = ko.observable(true);
    var itemArray = ko.observableArray();
    var controlArray = ko.observableArray([
        
    ]);
    
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id,function(){
            //after loading success
            if(cr.modal.current != cr.modal[name]){
                if(cr.modal.current){
                    cr.modal.current.hide();
                }
                cr.modal.current = cr.modal[name];
                cr.modal.current.show();
            }
            $('myModal').modal('show');
        });
        
        //todo: toggle loading
    });
    
    return {
        itemArray: itemArray,
        isHidden: isHidden,
        model: model,
        show: show,
        hide: hide,
    }
});

ko.applyBindings(cr.modal.news, $("#newsModal")[0]);
ko.applyBindings(cr.modal.disk, $("#diskModal")[0]);
ko.applyBindings(cr.modal.ticket, $("#ticketModal")[0]);
ko.applyBindings(cr.modal.sponsor, $("#sponsorModal")[0]);
ko.applyBindings(cr.modal.exco, $("#excoModal")[0]);