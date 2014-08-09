/**
 * baseModel.js
 * Credit to John Tan @ Film Society, HKUSTSU, Session 2013-2014
 * Copyright Jeff Sun @ Film Society, HKUSTSU, Session 2014-2015
 * Removed dirty utility.
 */
 
/**
 * Constructor for BaseModel singleton.
 * Construct a base model class and handle fundamental operations.
 * @constructor
 */
function BaseViewModel(modelName, hashTag, navBarTitle, pageLimit, pagerLimit) {
    //Store context into namespace, for possible encapsulation.
    var self = this
    Object.defineProperty(self, 'modelName', {
        value: modelName,
    });
    Object.defineProperty(self, 'hashTag', {
        value: hashTag,
    });
    Object.defineProperty(self, 'navBarTitle', {
        varlue: navBarTitle,
    });
    Object.defineProperty(self, 'pageLimit', {
        value: pageLimit,
    });
    Object.defineProperty(self, 'query', {
        value: {},
        writeable: true;
    });
    
    self.isHidden = ko.observable(true);
    //controls lie here, like search boxes or buttons.
    self.controlArray = ko.observableArray();
    
    //pagerButtons
    self.pagerArray = ko.observableArray();
    self.previousPageButton;
    self.nextPageButton
    
    //list items lie here.
    self.itemArray = ko.observableArray();
    
    
    //Array specifying fields exposed to users. Used as a filter by 
    self.userFields = [];
  
    //Array specifying fields to send to the server. Used as a filter by post() and put() function
    self.sendFields = [];
    
    //pageNumber
    self.pageNumber = 1;
    
    //totalPage
    self.totalPage = 1;
    
    
}

//Class methods and fields.
BaseViewModel.prototype = {
    /**
     * Flush the observed itemArray with the supplied data array
     * @param {array} data Array containing ko.observable()
     */
    flush: function(data) {
        var self = this;
        self.itemArray.removeAll();
        for (item in data) {
            itemArray.push(item);
        }
    },
    
    //update one object in the observed itemArray
    /*update: function(data) {
        var self=this;
        
    },*/
    
    //generic filtering function
    //take in ONE data object, apply filter, and return the result
    applyFilter: function (data, filter){
        var result = {};
        for (var field in data){
            if (filter.indexOf(field) != -1){
                result[field] = data[field];
            }
        } 
        return result;
    },
    
    //convert the supplied object into an observable
    toObservable: function (data){
        return ko.mapping.fromJS(data);
    },
    
    
    /**
     * Get one object using id. Won't be filtered automatically
     * @param {integer} id The id of the data
     * @param {Function} afterDone(data) The callback to call after retrieve data.
     */
    getOne: function(id, afterDone) {
        var self = this;
        var r = new apiRequest(self, 'GET', '/' + id + '/',true);
        r.done(function(data, stateText, jqXHR) {
            if (afterDone) {afterDone(data);}
            return data;
        });
        r.fail(function( jqXHR, textStatus, errorThrown){
        alert("apiRequest fail");
        });
    },
    
    //get a page of data and replace current page with the new one.
    getPage: function(pageNumber, afterDone) {
        var self = this;
        var r = new apiRequest(self, 'GET', '/?limit='+self.pageLimit+'&page='+pageNumber+'&'+$.param(self.query), true);
        
        r.done(function(data, textState, jqXHR){
            self.itemArray.removeAll();
            for (var obj in data.Objects){
                self.itemArray.push(self.toObservable(self.applyFilter(obj, self.userFields)));
            }
            self.pageNumber=pageNumber;
            self.totalPage=data.meta.total;
            self.previousPage=new PagerButton("Previous",data.meta.previous)
            self.refreshPagers(pageNumber);
            if (afterDone) {afterDone()};
        });
        
        r.fail(function(jqXHR, textState, errorThrown){
            alert("getPage fail");
        }
    },
    /**
     * edit a model information.
     * @param {id} id The id of model to edit
     * @param {Object} data Data to put
     * @param {boolean} update If true, update the cache based on return value
     * @param {Function} callback Function to call after successful access
     */
    putOne: function(id, data, update, afterDone) {
        var self = this;
        var r = apiRequest(self, 'PUT', '/' + id + '/', false, self.applyFilter(data,self.sendFields));
        r.done(function(data, stateText, jqXHR) {
            if (afterDone) {
                afterDone(data);
            }
        });
        r.fail(function( jqXHR, textStatus, errorThrown){
            alert("apiRequest fail");
        });
    },

    /**
     * create a model.
     * @param {Object} data Data to post
     * @param {Function} callback Function to call after successful access
     */
    postOne: function(data, afterDone) {
        var self = this;
        var r = apiRequest(self, 'POST', '/', false, self.applyFilter(data,self.sendFields));
        r.done(function(data, stateText, jqXHR) {
            if (afterDone) {
                afterDone(data);
            }
        });
        r.fail(function( jqXHR, textStatus, errorThrown){
            alert("apiRequest fail");
        });
    },

    /**
     * delete a model.
     * @param {integer} id ID of the instance to delete
     * @param {Function} callback Function to call after successful access
     */
    remove: function(id, afterDone) {
        var self = this;
        var r = apiRequest(self, 'DELETE', '/' + id + '/');
        r.done(function(data, stateText, jqXHR) {
            if (afterDone) {
                afterDone(data);
            }
        });
        r.fail(function( jqXHR, textStatus, errorThrown){
            alert("apiRequest fail");
        });
    },
    
    hookNav: function(callback) {
        var self=this;
        navBarViewModel.addItem(self.navBarTitle,self.hashTag);
        //register Sammy.js hash handler
        //root hash for this view.
        routeManager.get(self.hashTag, function() {
            navBarViewModel.activateItem(location.hash);
            
            if (currentView) {
                currentView.hide();
            }
            currentView=self;
            currentView.show();
            if (callback) {
                callback();
            }
        })
    },
    show:function(){
        self.isHidden(false);
    },
    hide:function(){
        self.isHidden(true);
    },

    
    //function checks and refreshes pager
    //if the destination page number lies out of the current page number, replace the pagers with the correct interval.
    refreshPagers: function (destinationPage){
        for (var pager in self.pagerArray) {
            if (pager.pageNumber == destinationPage) {
                this.pager.active(true);
                return;
            }
        }
        //here, destination page is out of range
        var startingPage = 1+destinationPage-destinationPage % self.pagerLimit;
        if (startingPage == destinationPage +1){
            startingPage -= self.pagerLimit;
        }
        //fill in the pagerArray according to startingPage and self.pagerLimit;
        self.pagerArray.removeAll();
        for (var i=startingPage; i<startingPage+self.pagerLimit && i<=self.totalPage; i++){
            self.pagerArray.push(new PagerButton(i));
        }
    },   
    
    //PagerButton: constructor for a pager button
    //Pay Attention: query refers to client-side routing
    PagerButton: function (pageNumber,query){
        this.pageNumber = ko.observable(pageNumber);
        query = query || self.hashTag+"/"+pageNumber+"/";
        this.href = ko.observable(query);
        this.active = ko.observable(false);
        this.disabled = ko.observable(false);
    },
    
    //buttonClick event handler
    buttonClick: function (clickedButton){
        if (!clickedButton.active){
            location.hash = clickedButton.href;
        }
    },
}

