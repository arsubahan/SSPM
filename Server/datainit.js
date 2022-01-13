var express = require('express');

var fs = require("fs");
var cnvjrouter = express.Router();
var cnvdb;
const path = require('path');
var mongoose = require('mongoose');var jsonFile = require('jsonfile')

dbname = "soccermongo";
mongoose.connect("mongodb://localhost/" + dbname, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error);
db.once("open", Startconvert);


function Startconvert() {
    const directoryPath = "c:/inetpub/wwwroot/webnewsoccer/client/jsondata"; //  path.join(__dirname, 'Documents');
  //  console.log("directorypath = " + directoryPath);
    var reqpath;
    var jsonObj;
  //  var files_ = [];
    var files = fs.readdir(directoryPath);
    var modelnm;


    for (var i in files) {
      //  if (files[i] != "Administrator.json" && files[i] != "memberfl.json" && files[i] != "convjson.html") {

            const data = require(path.resolve(directoryPath + "\\" + files[i]));
           // console.log("data from require = " + JSON.stringify(data));
            modelnm = files[i].split('.')
            cnvdb = require(path.resolve("./dbmodels") + "\\" + modelnm[0]);

            jsonData = {};
            jsonFile.readFileSync(wssfile, function (err, jsonData) {
                if (err) throw err;
                //  for (var j in jsonData) {

                console.log("jsondata : " + wssfile);
                console.log("Jsponfile = " + jsondata);
            

                //const createUsersWithMessages = async () 
                //{
                cnvdb.create(jsonData, function (err, data) {
                    if (err) throw err;
                });

         //   console.log("files[ +  + ] = " + files[i], path.resolve(directoryPath + "\\" + files[i]));
          //  console.log("modelmn = " + modelnm[0])
           // db.once("open", updmongo(path.resolve(directoryPath + "\\" + files[i])));

            // updmongo(path.resolve(directoryPath + "\\" + files[i]))
         //   db.close;

      //  } // if files not admin or member
    } //var i
   // process.exit();
} //start covert

//////////function updmongo(wssfile) {
//////////    jsonData = {};
//////////    jsonFile.readFileSync(wssfile, function (err, jsonData) {
//////////        if (err) throw err;
//////////      //  for (var j in jsonData) {

//////////            console.log("jsondata : " + wssfile);
//////////            console.log("Jsponfile = " + jsondata);
            

//////////            //const createUsersWithMessages = async () 
//////////            //{
//////////            cnvdb.create(jsonData, function (err, data) {
//////////                if (err) throw err;
//////////            });
//////////                //};

//////////     //   }
//////////        //jsonFile.unlink(wssfile, function (err) {

//////////            if (err) throw err;

//////////            // if no error, file has been deleted successfully

//////////            console.log("---------------------------------- for" + wssfile);

//////////        });



//////////   // });

//////////}




    ////////const directoryPath = "c:/inetpub/wwwroot/webnewsoccer/client/jsondata"; //  path.join(__dirname, 'Documents');
    ////////var files = fs.readdirSync(directoryPath);
    ////////var modelnm;
    ////////for (var i in files) {
    ////////    const data = require(path.resolve(directoryPath + "\\" + files[i]));
    ////////    modelnm = files[i].split('.')
    ////////    cnvdb = require(path.resolve("./dbmodels") + "\\" + modelnm[0]);
    ////////    console.log("files[ +  + ] = " + files[i], path.resolve(directoryPath + "\\" + files[i]));
    ////////    console.log("modelmn = " + modelnm[0])
    ////////    mongoose.connect("mongodb://localhost/" + dbname, { useNewUrlParser: true });
    ////////    db = mongoose.connection;
    ////////    db.on("error", console.error);
    ////////    db.once("open", function (err) {
    ////////        wssfile = path.resolve(directoryPath + "\\" + files[i]);
    ////////        jsonFile.readFile(wssfile, function (err, jsonData) {
    ////////            if (err) throw err;
    ////////            //  for (var j in jsonData) {

    ////////            console.log("jsondata : " + wssfile);

    ////////            cnvdb.create(jsonData);
    ////////            console.log(cnvdb.count);
    ////////            //   }
    ////////            //jsonFile.unlink(wssfile, function (err) {

    ////////            if (err) throw err;

    ////////            // if no error, file has been deleted successfully

    ////////            console.log("---------------------------------- for" + wssfile);

    ////////        });
    ////////    });
    ////////    db.on('SIGINT', function () {
    ////////        mongoose.connection.close(function () {
    ////////            console.log("Mongoose default connection is disconnected due to application termination");
    ////////            process.exit(0);
    ////////        });
    ////////    });


    ////////} // end of for i


