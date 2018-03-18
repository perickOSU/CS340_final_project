module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLaunchVehicles(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, payload_leo FROM sat_launch_vehicle", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.launchvehicles = results;
            complete();
        });
    }

    /*Display all launchvehicles */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getLaunchVehicles(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('launchvehicles', context);
            }

        }
    });

    /* Adds a launchvehicle, redirects to the launchvehicles page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_launch_vehicle (name, payload_leo) VALUES (?,?)";
        var inserts = [req.body.name, req.body.payload_leo];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/launchvehicles');
            }
        });
    });

    return router;
}();
