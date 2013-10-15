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
	      data.rows.forEach(function(route){
	  			var routeFeature = {};
	  			routeFeature.type="Feature";
	  			routeFeature.geometry = JSON.parse(route.route_shape);
	  			routeFeature.properties = {};
	  			routeFeature.properties.route_id = route.route_id;
	  			routeFeature.properties.route_short_name = route.route_short_name;
	  			routeFeature.properties.route_long_name = route.route_long_name;
	  			routeFeature.properties.route_color = route.route_color;
	  			routesCollection.features.push(routeFeature);
	  		});
	  		var topology = topojson.topology({routes: routesCollection},{"property-transform":preserveProperties});
	  		res.send(JSON.stringify(topology));
	  		//res.json(routesCollection);
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
	      data.rows.forEach(function(stop){
	  			var stopFeature = {};
	  			stopFeature.type="Feature";
	  			stopFeature.geometry = JSON.parse(stop.stop_shape);
	  			stopFeature.properties = {};
	  			stopFeature.properties.stop_id = stop.stop_id;
	  			stopFeature.properties.stop_code = stop.stop_code;
	  			stopFeature.properties.stop_name= stop.stop_name;
	  			
	  			stopsCollection.features.push(stopFeature);
	  		});
	  		var topology = topojson.topology({stops: stopsCollection},{"property-transform":preserveProperties});
	  		res.send(JSON.stringify(topology));
	  		//res.json(routesCollection);
	  	});
	  });
	}
};
