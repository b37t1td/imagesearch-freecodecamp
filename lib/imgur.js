var imgurg = exports;
var request = require('request');

imgurg.cid = process.env.IMGUR_CLIENT_ID;

imgurg.query = function(query, page, callback){
	var query = { c: String(query) }
	var subcat = (query.c).match(/(?:^r\/)(.*)/);
	query.e = subcat && encodeURIComponent((query.c).substring(2,(query.c).length)) || encodeURIComponent(query.c);

	var options = {
		encoding: 'utf8',
		json: true,
    uri : 'https://api.imgur.com/3/gallery/search/top/'+page+'?q='+query.e,
		headers: {
			'Authorization': 'Client-ID '+ imgurg.cid
		},
		method: 'GET'
	}

	function tError(stat, err, body){
    callback('error');
		return false
	}

	function isObjectEmpty(obj) {
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}

	request(options, function (err, res, body) {
			if ( (err != "" && body !== undefined) || res.statusCode !== 200 ){
				if(body.data === undefined || isObjectEmpty(body.data) ){ return tError(res.statusCode, err, body); }
          callback(null, body.data.map(function(d) {
            return {
              title : d.title,
              link : 'http://imgur.com/' + d.id,
              image : d.link,
              time : d.datetime
            };
          }));
			}else{ return tError(res.statusCode, err, body); }
	});
}
