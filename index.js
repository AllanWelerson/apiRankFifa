'use strict'

console.log("Iniciando");

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use((req, res, next)=>{

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods','GET');
    //res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



router.get('/rank', function (req, res, next) {
    request('https://www.fifa.com/fifa-world-ranking/ranking-table/men/#all', (err, response, body)=> {

        if(err) console.log('Erro: ' + err);

        let $ = cheerio.load(body);
        let title = $(".fi-ranking-schedule__title").text().trim();
        
        let rank = [];

        $("#rank-table tbody tr").each(function (){
        
            const team = $(this).find(".fi-table__teamname .fi-t__nText ").text().trim();
            const position = $(this).find(".fi-table__rank span").text().trim();
            const points = $(this).find(".fi-table__points .text").text().trim();
            const previousPoints = $(this).find(".fi-table__prevpoints .text").text().trim();
            const confederation = $(this).find(".fi-table__confederation .text").text().trim().replace(/[#]+/g,'');
            const obj = { position: position, team: team, points: points, previousPoints: previousPoints, confederation: confederation};
            rank.push(obj);  
            
        });
        
        res.json(rank);

    });
  });

app.use('/', router);

var porta = process.env.Port || 8080;

app.listen(porta);
