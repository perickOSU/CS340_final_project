module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLaunchVehicle(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM sat_launch_vehicle", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.launchvehicles  = results;
            complete();
        });
    }

    function getSatellitesFilterVehicle(res, mysql, context, id, complete){
		var base_sql = "SELECT sat_satellite.id, sat_satellite.name, sat_launch_vehicle.name AS launch_vehicle, longitude FROM sat_satellite INNER JOIN sat_launch_vehicle ON launch_vehicle = sat_launch_vehicle.id";

		if (id === "null") {
			var sql = base_sql;
			var inserts = [];
		} else {
			var sql = base_sql + " WHERE sat_launch_vehicle.id=?";
			var inserts = [id];
		}
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.satellitesfiltervehicle = results;
            complete();
        });
    }



    /*Display all satellitesfiltervehicle. Requires web based javascript to delete users with AJAX*/

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getSatellitesFilterVehicle(res, mysql, context, req.params.id, complete);
        getLaunchVehicle(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('satellitesfiltervehicle', context);
            }

        }
    });


    /* redirects to the satellitesfiltervehicle/sat_launch_vehicle.id page */

    router.post('/', function(req, res){
		res.redirect('/satellitesfiltervehicle/' + req.body.launch_vehicle);
	});

    return router;
}();
