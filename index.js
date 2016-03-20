#!/usr/bin/env node
require('dotenv').config({silent: true});

var program = require('commander'),
    package = require('./package.json'),
    Bitly = require('bitly'),
    bitly = new Bitly(process.env.API_KEY),
    fs = require('fs');

if(process.env.API_KEY === undefined) {
    console.log('Add your API key by running: shorturl setup')
}

program
    .version(package.version)
    .usage('<url>');

program
    .command('setup [apikey]')
    .description('sets up short url service with bit.ly')
    .action(function(apikey) {
        fs.writeFile('.env', 'API_KEY=' + apikey, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });

program.parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    if(process.env.API_KEY != undefined) {
        bitly.shorten(program.args)
            .then(function(response) {
                var shortUrl = response.data.url;
                console.log(shortUrl);
            }, function(error) {
                throw error;
            });
    }
}