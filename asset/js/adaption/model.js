/**
 * @fileoverview Provide model utility.
 */
cr.define('cr', function() {
    'use strict';
    var dirty_listening = [];

    /**
     * Constructor for BaseModel singleton.
     * Construct a base model class and handle fundamental operation.
     * @constructor
     */
    function BaseModel(name) {
        Object.defineProperty(this, 'name', {
            value: name,
        });
        this.data = {};
        this.fields = [];
        this.accessHistory = [];
    }

    /**
     * Provide API interface.
     * @param {Object} model The model to call on.
     * @param {string} method The method to use.
     * @param {string} api The API to call.
     * @param {boolean} force_new If true, bypass any cache.
     * @constructor
     */
    function APIRequest(model, method, api, force_new) {
        var self=this;
        var config = {
            url: cr.settings.api_base + model.name + api,
            type: method,
            cache: !force_new,
            headers: {
                X-Requested-With: XMLHttpRequest
            },
            xhrFields: {
                withCredentials: true
            },
            data: null,
            success: function(data, textState, jqXHR){
                try {
                self.success = data.errno === 0;
                self.data = data;
                e = new cr.Event((obj.errno === 0) ? 'load' : 'error', false, true);
                e.recObj = obj
                } catch (exception) {
                    self.success = false;
                    self.data = {
                        errno: 2,
                        error: "Error receiving data"
                    };
                    e = new cr.Event('error', false, true);
                    e.recObj = {
                        errno: 2,
                        error: "Error receiving data"
                    };
                }
                self.dispatchEvent(e);
            },
            error:function(jqXHR, textStatus, errorThrown)){
                self.success = false;
                self.data = {
                    errno: jqXHR.status,
                    error: jqXHR.statusText
                };
                e = new cr.Event('error', false, true);
                e.recObj = {
                    errno: jqXHR.status,
                    error: jqXHR.statusText
                };
                self.dispatchEvent(e);
            }
        };
    }


    extend(APIRequest, cr.EventTarget);
    APIRequest.prototype.extend({
        /**
         * Default interface of event
         */
        onload: null,
        onerror: null,
        onuploadprogress: null,
        onloadprogress: null,

        /**
         * Simply send request
         */
        send: function() {
            $.ajax(this.config);
        },

        /**
         * Post raw data. Used when posting FormData
         * @param {string} data The data to send
         */
        sendRaw: function(data) {
            this.config.data=data;
            $.ajax(this.config);
        },

        /**
         * Post form data.
         * @param {string} data The data to send
         */
        sendForm: function(data) {
            this.config.headers["Content-Type"]="application/x-www-form-urlencoded";
            this.config.data=data;
            $.ajax(this.config);
        },

        /**
         * Post json data.
         * @param {Object} obj The obj to send
         */
        sendJSON: function(obj) {
            this.config.headers["Content-Type"]="application/json";
            this.config.data=obj;
            $.ajax(this.config);
        }
    });

    BaseModel.prototype = {
        /**
         * SYS: filter using fields specified.
         * data must be the object under "Objects" if the request was made using query other than id. 
         * In this case, a meta object will be on the same level as object, which is what we don't want to carry in our observables.
         */
        filter: function(data){
            var result ={};
            for (var key in data) {
                if (this.fields.indexOf(key) !== -1) {
                    result[key] = data[key];
                }
            }
            return result;
        }
    
    
        /**
         * Update the data in the cache.
         * @param {Object} data The data to update
         */
        update: function(data) {
            if (!this.data){
                this.data = ko.mapping.fromJS(this.filter(data));
                this.accessHistory.push = this.data.id();
            } else {
                ko.mapping.fromJS(this.filter(data),this.data);
                this.accessHistory.push = this.data.id()
            }
        },

        /**
         * Get the data using id. May use data in cache if not dirty.
         * @param {integer} id The id of the data
         * @param {Function} callback The callback to call after retrieve data.
         */
        get: function(id, callback) {
            if (this.data && this.data.id()==id) {
                if (callback) {
                    callback(this.data));
                }
            } else {
                //retrieve it
                var r = new APIRequest(this, 'GET', '/' + id + '/', this.data);
                r.onload = (function(e) {
                    this.update(e.recObj);
                    if (callback) {
                        callback(deepCopy(this.data.data));
                    }
                }).bind(this);
                r.onerror = function(e) {
                    cr.errorHandler(e);
                };
                r.send();
            }
        },

        /**
         * edit a model information.
         * @param {id} id The id of model to edit
         * @param {Object} data Data to put, in plain object form. Should contain only the fields that need update.
         * @param {boolean} update If true, update the cache based on return value
         * @param {Function} callback Function to call after successful access
         */
        put: function(id, data, update, callback) {
            var r = new APIRequest(this, 'PUT', '/' + id + '/');
            r.onload = (function(e) {
                if (update) {
                    this.update(e.recObj);
                }
                if (callback) {
                    callback(deepCopy(this.data.data));
                }
            }).bind(this);
            r.onerror = function(e) {
                cr.errorHandler(e);
            };
            r.sendJSON(data);
        },

        /**
         * create a model.
         * @param {Object} data Data to post
         * @param {Function} callback Function to call after successful access
         */
        post: function(data, callback) {
            var r = new APIRequest(this, 'POST', '/');
            r.onload = (function(e) {
                this.update(e.recObj);
                if (callback) {
                    callback(deepCopy(e.recObj));
                }
            }).bind(this);
            r.onerror = function(e) {
                cr.errorHandler(e);
            };
            r.sendJSON(data);
        },

        /**
         * delete a model.
         * @param {integer} id ID of the instance to delete
         * @param {Function} callback Function to call after successful access
         */
        remove: function(id, callback) {
            var r = new APIRequest(this, 'DELETE', '/' + id + '/');
            r.onload = (function(e) {
                if (this.data.id()==e.recObj.id) {
                    
                    //remove from history all the ids that are equal to this.data.id;
                   
                    //load the newest one
                    
                    // but do i need to do that?
                }
                if (callback) {
                    callback(e.recObj);
                }
            }).bind(this);
            r.onerror = function(e) {
                cr.errorHandler(e);
            };
            r.send();
        },
    }

    
    return {
        BaseModel: BaseModel,
        APIRequest: APIRequest,
    };
});
