/**
 * @fileoverview Provide management of paging.
 */

cr.define('cr', function() {
  'use strict';

  /**
   * Constructor for a page manager.
   * Construct a page manager using specific model and query.
   * @param {BaseModel} model The model to use in pager
   * @param {string} query The query string to use
   * @constructor
   */
  function Pager(model, query) {
    Object.defineProperty(this, 'model', {
      value: model,
    });
    
    this.hasPrev = ko.computed(function() {
        return this.meta.previous().length > 0;
    });
    
    this.hasNext = ko.computed(function() {
        return this.meta.next().length > 0;
    });
    
    this.page = ko.computed(function() {
        return this.pos();
    });
    
    this.total = ko.compouted(function(){
        return this.meta.total();
    });
    
    
    this.meta=null;
    this.itemList = ko.observableArray();
    //SYS
    this.pagenationList = ko.observableArray();
    this.pos = ko.observable(1);
    this.query = query;
    (loadPage.bind(this))(1);
  }
  

  /**
   * Load a page.
   * @param {integer} pos The pageNumber.
   * @param {Function} callback The callback after loading.
   */
    function loadPage(pos, callback){
        var r=new APIRequest(this.model, 'GET', this.query+'&page='+pos);
        r.onload = (function(ev) {
            //refresh page position
            this.pos(pos);
            //get the response data
            var obj = ev.recObj;
            //copy the metadata
            if (!this.meta) {
                this.meta = ko.mapping.fromJS(deepCopy(obj.meta))
            } else {
                ko.mapping.fromJS(deepCopy(obj.meta),this.meta);
            };
            //push the page into itemList
            //first clean itemList
            itemList.removeAll();
            for (var i=0; i<obj.objects.length; i++) {
                
                this.itemList.push(this.model.filter(obj.objects[i]));
            }
            if (callback) {
                callback.call(this, itemList);
            }
        }).bind(this);
        r.onerror = cr.errorHandler;    
        r.send();
    }

    Pager.prototype = {
    

    /**
     * Move to the next page. Stay if no next page.
     * @param {Function} callback The callback after loading.
     */
    next: function(callback) {
      if (this._cache.meta.next()){
        this.pos(this.pos()+1);
      }
      (loadPage.bind(this))(this.pos, function() {
        if(callback)
          callback.apply(this, arguments);
      });
    },

    /**
     * Move to the previous page. Stay if no previous page.
     * @param {Function} callback The callback after loading.
     */
    prev: function(callback) {
      if (this._cache.meta.previous()) {
        this.pos(this.pos()-1);
      }
      (loadPage.bind(this))(this.pos, function() {
        if(callback)
          callback.apply(this, arguments);
      });
    }
  };

  return {
    Pager: Pager,
  };
});
