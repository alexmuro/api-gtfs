var topojson = require("topojson");
/**
 * AgencyController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var preserveProperties = function(properties, key, value) {
	properties[key] = value;
	return true;
};


module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
	routes: function(req,res){


	 	Agency.findOne(req.param('id')).exec(function (err, agency) {

		  	var routesCollection = {};
		  	routesCollection.type = "FeatureCollection";
		  	routesCollection.features = [];
		  	var sql = 'select ST_AsGeoJSON(geom) as route_shape,route_id,route_short_name,route_long_name,route_color from "'+agency.current_datafile+'".routes'
		  	Route.query(sql,{},function(err,data){
		  		if (err) {
		       res.send('{status:"error",message:"'+err+'"}',500);
		       return console.log(err);
		      }
		      data.rows.forEach(function(route,index){
		  			var routeFeature = {};
		  			routeFeature.type="Feature";
		  			routeFeature.geometry = JSON.parse(route.route_shape);
		  			routeFeature.id = index;
		  			routeFeature.properties = {};
		  			routeFeature.properties.route_id = route.route_id;
		  			routeFeature.properties.route_short_name = route.route_short_name;
		  			routeFeature.properties.route_long_name = route.route_long_name;
		  			routeFeature.properties.route_color = route.route_color;
		  			routesCollection.features.push(routeFeature);
		  		});
		  		if(req.param('format') == 'geo'){
		  			//JSON.stringify();
		  			res.send(routesCollection);	
		  		}else{
		  			var topology = topojson.topology({routes: routesCollection},{"property-transform":preserveProperties});
		  			res.send(topology);
		  			//JSON.stringify()
		  			
		  		}
		  		
		  	});
	  	});
	},
	routeSchedule: function(req,res){
		if(typeof req.param('id') == 'undefined'){
			res.send('{status:"error",message:"Missing parameter: id. (Agency)"}',500);		
		}
		if(typeof req.param('day') == 'undefined'){
			res.send('{status:"error",message:"Missing parameter: day."}',500);
		}
		if(typeof req.param('route_id') == 'undefined'){
			res.send('{status:"error",message:"Missing parameter: route_id."}',500);
		}
	 	Agency.findOne(req.param('id')).exec(function (err, agency) {

		  	var routesCollection = {};
		  	routesCollection.type = "FeatureCollection";
		  	routesCollection.features = [];
		  	var sql = "SELECT a.trip_id,a.arrival_time,a.stop_id,a.stop_sequence,b.direction_id "
						+ "from \""+agency.current_datafile+"\".stop_times as a "
						+ "join \""+agency.current_datafile+"\".trips as b "
						+ "on b.trip_id = a.trip_id "
						+ "join \""+agency.current_datafile+"\".calendar as c "
						+ "on c.service_id = b.service_id "
						+ "where route_id = '"+req.param('route_id')+"' "
						+ "and c."+req.param('day')+" "
						+ "order by trip_id,stop_sequence";
			Route.query(sql,{},function(err,data){
		  		if (err) {
		       res.send('{status:"error",message:"'+err+'"}',500);
		       return console.log(err);
		      }
		      return res.json(data.rows);
		  	});
	  	});
	},

	stops: function(req,res){
  	 
	  Agency.findOne(req.param('id')).exec(function (err, agency) {

	  	var stopsCollection = {};
	  	stopsCollection.type = "FeatureCollection";
	  	stopsCollection.features = [];
	  	var sql = 'select ST_AsGeoJSON(geom) as stop_shape,stop_name,stop_id,stop_code from "'+agency.current_datafile+'".stops'
	  	Route.query(sql,{},function(err,data){
	  		if (err) {
	       res.send('{status:"error",message:"'+err+'"}',500);
	       return console.log(err);
	      }
	      data.rows.forEach(function(stop,index){
	  			var stopFeature = {};
	  			stopFeature.type="Feature";
	  			stopFeature.id = index;
	  			stopFeature.geometry = JSON.parse(stop.stop_shape);
	  			stopFeature.properties = {};
	  			stopFeature.properties.stop_id = stop.stop_id;
	  			stopFeature.properties.stop_code = stop.stop_code;
	  			stopFeature.properties.stop_name= stop.stop_name;
	  			
	  			stopsCollection.features.push(stopFeature);
	  		});
	  		
	  		//res.json(routesCollection);
	  		if(req.param('format') == 'geo'){
		  			//JSON.stringify();
		  			res.json(stopsCollection);	
		  		}else{
		  			var topology = topojson.topology({stops: stopsCollection},{"property-transform":preserveProperties});
	  				res.json(topology);
		  			//JSON.stringify()  			
		  		}
	  	});
	  });
	}
};
