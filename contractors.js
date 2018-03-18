module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getContractors(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, revenue FROM sat_contractor", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.contractors = results;
            complete();
        });
    }

    /*Display all contractors */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getContractors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('contractors', context);
            }

        }
    });

    /* Adds a contractor, redirects to the contractors page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sat_contractor (name, revenue) VALUES (?,?)";
        var inserts = [req.body.name, req.body.revenue];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/contractors');
            }
        });
    });

    return router;
}();
