/**
 * @fileoverview Models used in front end. 
 * Directly corresponds to the objects served in the background.
 */
var File = new BaseModel('file'),
    User = new BaseModel('user'),
    Disk = new BaseModel('disk'),
    RegularFilmShow = new BaseModel('regularfilmshow'),
    PreviewShowTicket = new BaseModel('previewshowticket'),
    DiskReview = new BaseModel('diskreview'),
    News = new BaseModel('news'),
    Document = new BaseModel('document'),
    Publication = new BaseModel('publication'),
    Sponsor = new BaseModel('sponsor'),
    Exco = new BaseModel('exco'),
    SiteSettings = new BaseModel('sitesettings'),
    OneSentence = new BaseModel('onesentence');
    Log = new BaseModel('log'),

File.fields = [
    'id',
    'name',
    'url',
];

User.fields = [
    'id',
    'expire_at',
    'admin',
    'full_name',
    'itsc',
    'member_type',
    'pennalized',
    'rfs_count',
    'login_count',
];

Disk.fields = [
    'id',
    'director_en',
    'director_ch',
    'category',
    'create_log',
    'imdb_url',
    'show_year',
    'avail_type',
    'actors',
    'desc_en',
    'tags',
    'title_en',
    'cover_url',
    'disk_type',
    'due_at',
    'borrow_cnt',
    'length',
    'desc_ch',
    'title_ch',
    'user_held',
];

Disk.CN = function(disk) {
    return disk.disk_type + pad(disk.id, 4);
}

RegularFilmShow.fields = [
    'id',
    'state',
    'film_1',
    'film_2',
    'film_3',
    'vote_cnt_1',
    'vote_cnt_2',
    'vote_cnt_3',
    'remarks',
    'create_log',
];

PreviewShowTicket.fields = [
    'id',
    'state',
    'title_en',
    'title_ch',
    'desc_en',
    'desc_ch',
    'director_en',
    'director_ch',
    'actors',
    'cover_url',
    'language',
    'subtitle',
    'venue',
    'show_time',
    'apply_deadline',
    'length',
    'quantity',
    'remarks',
    'successful_applicant',
    'create_log',
];

DiskReview.fields = [
    'id',
    'disk',
    'content',
    'create_log',
];

News.fields = [
    'id',
    'title',
    'content',
    'create_log',
];

Document.fields = [
    'id',
    'title',
    'doc_url',
    'create_log',
];

Publication.fields = [
    'id',
    'pub_type',
    'title',
    'cover_url',
    'doc_url',
    'ext_doc_url',
    'create_log',
];

Sponsor.fields = [
    'id',
    'name',
    'img_url',
];

Exco.fields = [
    'id',
    'name_en',
    'name_ch',
    'descript',
    'position',
    'email',
    'img_url',
];

SiteSettings.fields = [
    'id',
    'key',
    'value',
];
SiteSettings._cache_dict = {};

SiteSettings.loadSettings = function(callback) {
    var r = apiRequest(this, 'GET', '/', true);
    r.done(function(data, stateText, jqXHR) {
        for (var i = 0; i < e.recObj.objects.length; i++) {
            SiteSettings.update(e.recObj.objects[i], 1);
            SiteSettings._cache_dict[e.recObj.objects[i].key] = e.recObj.objects[i].id;
        }
        if (callback) {
            callback();
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
        alert("apiRequest fail");
    )}
};
SiteSettings.getField = function(field) {
    if (!this._cache_dict[field]) {
        return null;
    }
    return this._cache[this._cache_dict[field]].data;
};

OneSentence.fields = [
    'id',
    'content',
    'film',
];

Log.fields = [
    'id',
    'model',
    'log_type',
    'model_refer',
    'user_affected',
    'admin_involved',
    'content',
    'created_at',
];