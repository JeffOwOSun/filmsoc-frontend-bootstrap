/**
 * apiRequest.js
 */
 
/**
 * Provide API interface.
 * @param {Object} BaseModel The model to retrieve.
 * @param {string} method The method to use.
 * @param {string} api The API to call.
 * @param {boolean} force_new If true, bypass any cache.
 * @param {Object} data The plain object.
 * @return {jqXHR} the jqXHR object
 */

function apiRequest(model, method, api, force_new, data) {
    var baseUrl = globalSettings.apiBase + model.modelName + api;
    return $.ajax(baseUrl, {
        cache: ((method === 'GET' && force_new) ? false : true),
        type: method,
        data: data || null,
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    });
}
