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

    function getContractors(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM sat_contractor", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.contractors  = results;
            complete();
        });
    }


    function getContractorsSatellites(res, mysql, context, complete){
        mysql.pool.query("select sat_satellite.name as satellite_name, sat_contractor.name as contractor_name, bid, sid  from sat_contractor inner join sat_contractor_satellite on sat_contractor.id=sat_contractor_satellite.bid inner join sat_satellite on sat_contractor_satellite.sid=sat_satellite.id ORDER BY sid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.contractorssatellites = results;
            complete();
        });
    }

    /*Display all contractorssatellites. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getContractorsSatellites(res, mysql, context, complete);
        getContractors(res, mysql, context, complete);
        getSatellites(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('contractorssatellites', context);
            }

        }
    });


    /* Adds a contractorsatellite, redirects to the contractorssatellites page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_contractor_satellite (bid, sid) VALUES (?,?)";
        var inserts = [req.body.bid, req.body.sid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/contractorssatellites');
            }
        });
    });


    return router;
}();
