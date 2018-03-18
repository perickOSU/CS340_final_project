module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCountries(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, population FROM sat_country", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.countries = results;
            complete();
        });
    }

    /*Display all countries */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCountries(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('countries', context);
            }

        }
    });

    /* Adds a country, redirects to the countries page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_country (name, population) VALUES (?,?)";
        var inserts = [req.body.name, req.body.population];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/countries');
            }
        });
    });

    return router;
}();
