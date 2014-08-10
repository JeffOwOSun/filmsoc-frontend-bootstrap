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
    
    //this one stores info of the film,
    //each item is a label: content pair
    var itemArray = ko.observableArray();
    
    var controlArray = ko.observableArray([
        {
            label: "Reserve" ,
            click: function() {
                //todo
            }
        },
    ]);
    
    function reserveClick(){
        var r=new cr.APIRequest(model, "POST", "/" + model.data.id() +"/reservation/");
    }
    
    function show(){
        isHidden(false);
    }
    
    function hide(){
        isHidden(true);
    }
      
    cr.routeManager.get(hashTag+'/:id/',function(){
        //todo: now loading
    
        model.get(id, function(){
            //after loading success
            itemArray.removeAll();
            itemArray.push([
                {
                    name:"Director",
                    content:model.data.director_en()+' / '+model.data.director_ch(),
                },
                {
                    name:"Stars",
                    content:model.data.actors().join(', '),
                },
                {
                    name:"Category",
                    content:model.data.category(),
                },
                {
                    name:"Tags",
                    content:model.data.tags().join(' '),
                },
                {
                    name:"Length",
                    content:model.data.length()+' min.',
                },
                {
                    name:"IMDB Link",
                    content:model.data.imdb_url(),
                    href:"www.imdb.com/title/"+model.data.imdb_url(),
                },
                {
                    name:"Call Number",
                    content:model.data.disk_type()+model.data.id(),
                },
                {
                    name:"Disk Type",
                    content:(function(){
                    switch model.data.disk_type()
                        case 'A':
                            return 'VCD';
                            break;
                        case 'B':
                            return 'DVD';
                            break;
                    })(),
                },
                {
                    name:"Borrowed",
                    content:model.data.borrow_cnt()+' time(s)',
                },
                {
                    name:"Disk State",
                    content:model.data.avail_type(),
                },
            ]);
            
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