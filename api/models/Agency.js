/**
 * Agency
 *
 * @module      :: Agency
 * @description :: Transit Agencies, ie MTA or CDTA
 *
 */

module.exports = {
	tableName: 'sails_agency',
  attributes: {
  	
  	date_last_updated: {type:'INTEGER'},
    feed_baseurl: {type:'STRING'},
    name: {type:'STRING'},
    area: {type:'STRING'},
    url: {type:'STRING'},
    country: {type:'STRING'},
    state: {type:'STRING'},
    license_url: {type:'STRING'},
    dataexchange_url: {type:'STRING'},
    date_added: {type:'INTEGER'},
    is_official: {type:'INTEGER'},
    dataexchange_id: {type:'STRING'},
    current_datafile: {type:'STRING'}
    
  }

};
	