﻿'use strict';
var express = require('express');
var path = require('path');
var https = require('https');
var http = require('http');
var bodyParser = require("body-parser");
var PORT  = process.env.PORT || 5000;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', {fname: 'gutohrs', lName: 'hewgors'});
});

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
});

app.get("/main/:id", async function (req, res) {
    var nameid = req.params.id;
    console.log(nameid);
    const data = await getStudentInfo(nameid);
    console.log(data);
    if (data) {
        let j = JSON.parse(data);
        res.render("main",
            {
                prefix: j.data.prefixname,
                name_th: j.data.displayname_th,
                name_en: j.data.displayname_en,
                email: j.data.email,
                faculty: j.data.faculty,
                department: j.data.department
            });
    }

});
app.get('/main', function (req, res) {
    res.render('main')
});
app.get('/logout', function (req, res) {
    res.render('index')
});
app.get('/Fill-up', function (req, res) {
    res.render('Fill-up')
});
app.post("/api", async (req, res) => {

    console.log(req.body);
    const temp = await getlogin(req.body.user, req.body.pwd);
    console.log("temp = " + temp);
    if (temp) {
        let j = JSON.parse(temp);
        console.log(j);
        if (j.status == true) {
            res.send(temp);
        } else {
            res.send('{"status":false}');
        }
    } else {
        res.send('{"status":false}');
    }
});

const getlogin = (userName, password) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'hostname': 'restapi.tu.ac.th',
            'path': '/api/v1/auth/Ad/verify',
            'headers': {
                'Content-Type': 'application/json',
                'Application-Key': 'TU69e3ac6f76a80601459e0900b0cc4c9bf015ba6425b741a52aaefbf29f5b6d90dcfc64830fb0a430e7eed64b5251c042'
            }
        };

        var req = https.request(options, (res) => {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(body.toString());
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });
        var postData = "{\n\t\"UserName\":\"" + userName + "\",\n\t\"PassWord\":\"" + password + "\"\n}";
        req.write(postData);
        req.end();
    });
};

const getStudentInfo = (username) => {
    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            hostname: "restapi.tu.ac.th",
            path: "/api/v2/profile/std/info/?id=" + username,
            headers: {
                "Content-Type": "application/json",
                "Application-Key":
                    "TU2791e6ef3a03ece19159c4309b047384b84008287834e184cef9943a97936ce4436bb097531501a1c3fdf8029ec9332f",
            },
        };

        var req = https.request(options, (res) => {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                //result = body;
                resolve(body.toString());
                //result = chunks;
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error);
            });
        });

        req.end();
    });
};



const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/posts/1/comments',
    method: 'GET',
    'headers': {
        'Content-Type': 'application/json',
    }
};

function dataCounter(inputs) {
    let counter = 0;
    for (const input of inputs) {
        if (input.postId === 1) {
            counter += 1;
            console.log('input.postId:' + input.postId);
            console.log('input.email:' + input.email);
        }
    }
    return counter;
};

const req = http.request(options, function(response) {
    response.setEncoding('utf8');
    var body = '';
    response.on('data', chunk => {
        body += chunk;
    });

    response.on('end', () => {
        console.log('body:' + body);
        var data = JSON.parse(body);
        console.log('number of posts:' + dataCounter(data));
        console.log('data:' + data);
        console.log('data[0]:' + data[0]);
        console.log('data[0].id:' + data[0].id);
        console.log('data[0].email:' + data[0].email);
        console.log('end of GET request');
    });
});

req.on('error', e => {
    console.log('Problem with request:', e.message);
});
req.end();