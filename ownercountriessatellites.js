module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSatellites(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM sat_satellite", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.satellites  = results;
            complete();
        });
    }

    function getCountries(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM sat_country", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.countries  = results;
            complete();
        });
    }


    function getOwnerCountriesSatellites(res, mysql, context, complete){
        mysql.pool.query("select sat_satellite.name as satellite_name, sat_country.name as country_name, cid, sid  from sat_country inner join sat_owner_country_satellite on sat_country.id=sat_owner_country_satellite.cid inner join sat_satellite on sat_owner_country_satellite.sid=sat_satellite.id ORDER BY sid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ownercountriessatellites = results;
            complete();
        });
    }

    /*Display all ownercountriessatellites. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOwnerCountriesSatellites(res, mysql, context, complete);
        getCountries(res, mysql, context, complete);
        getSatellites(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('ownercountriessatellites', context);
            }

        }
    });


    /* Adds a ownercountrysatellite, redirects to the ownercountriessatellites page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_owner_country_satellite (cid, sid) VALUES (?,?)";
        var inserts = [req.body.cid, req.body.sid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/ownercountriessatellites');
            }
        });
    });


    return router;
}();
