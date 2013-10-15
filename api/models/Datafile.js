/**
 * Datafile
 *
 * @module      :: Datafile
 * @description :: Analagous to GTFS-DATA-EXCHANGE.com datafile
 *
 */

module.exports = {
 	
  attributes: {
  	agency_id: {type:'STRING',required: true},
  	datafile_id: {type:'STRING',required: true},
  	date_added: {type:'INTEGER'},
		description: {type:'STRING'},
    file_url: {type:'STRING'},
		filename: {type:'STRING'},
    md5sum: {type:'STRING'},
    size: {type:'INTEGER'},
    uploaded_by_user: {type:'STRING'},
    gtfs_loaded: {type:'STRING'}
    
  }

};
