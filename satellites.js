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

    function getSatellites(res, mysql, context, complete){
        mysql.pool.query("SELECT sat_satellite.id, sat_satellite.name, sat_launch_vehicle.name AS launch_vehicle, longitude FROM sat_satellite INNER JOIN sat_launch_vehicle ON launch_vehicle = sat_launch_vehicle.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.satellites = results;
            complete();
        });
    }

    function getSatellite(res, mysql, context, id, complete){
        var sql = "SELECT id, name, launch_vehicle, longitude FROM sat_satellite WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.satellite = results[0];
            complete();
        });
    }

    /*Display all satellites. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesatellite.js"];
        var mysql = req.app.get('mysql');
        getSatellites(res, mysql, context, complete);
        getLaunchVehicle(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('satellites', context);
            }

        }
    });

    /* Display one satellite for the specific purpose of updating satellites */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedlaunchvehicle.js", "updatesatellite.js"];
        var mysql = req.app.get('mysql');
        getSatellite(res, mysql, context, req.params.id, complete);
        getLaunchVehicle(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-satellite', context);
            }

        }
    });

    /* Adds a satellite, redirects to the satellites page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_satellite (name, launch_vehicle) VALUES (?,?)";
        var inserts = [req.body.name, req.body.launch_vehicle];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/satellites');
            }
        });
    });

    /* The URI that update data is sent to in order to update a satellite */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE sat_satellite SET name=?, launch_vehicle=?, longitude=? WHERE id=?";
        var inserts = [req.body.name, req.body.launch_vehicle, req.body.longitude, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a satellite, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sat_satellite WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
