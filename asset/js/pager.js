/**
 * pager.js
 */
 
function Pager(model, limit) {
    var self = this;
    self.name = model.name;
    self.limit =limit
    self.currentPageNumber;
    self.next ='';
    self._cache = {};
    self.page = ko.observableArray();
    self.fetchPage = function (pageNumber){
        var r = apiRequest(model, "GET", '/?limit='+self.limit+'&page='+pageNumber, true);
        r.done(function(data){
            self.emptyPage();
            for (obj in data.Objects){
                //First parse the Plain Object into an observable,
                //Then push the parsed observable into the observableArray.
                self.page.push(ko.binding.fromJS(obj));
            }
        });
    }
    self.emptyPage = function () {
        page.removeAll();
    }
    self.initialize = function() {
        fetchPage(1);
    }
}