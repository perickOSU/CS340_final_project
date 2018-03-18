module.exports = function(){
    var express = require('express');
    var router = express.Router();

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


    function getContractorsCountries(res, mysql, context, complete){

        mysql.pool.query("select sat_contractor.name as contractor_name, sat_country.name as country_name, bid, cid  from sat_contractor inner join sat_contractor_country on sat_contractor.id = sat_contractor_country.bid inner join sat_country on sat_contractor_country.cid = sat_country.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.contractorscountries = results;
            complete();
        });
    }

    /*Display all contractorscountries. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecontractorcountry.js"];
        var mysql = req.app.get('mysql');
        getContractorsCountries(res, mysql, context, complete);
        getContractors(res, mysql, context, complete);
        getCountries(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('contractorscountries', context);
            }

        }
    });


    /* Adds a contractorcountry, redirects to the contractorscountries page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_contractor_country (bid, cid) VALUES (?,?)";
        var inserts = [req.body.bid, req.body.cid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/contractorscountries');
            }
        });
    });


    /* Route to delete a contractorcountry, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:bid/:cid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sat_contractor_country WHERE bid=? AND cid=?";
        var inserts = [req.params.bid, req.params.cid];
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
