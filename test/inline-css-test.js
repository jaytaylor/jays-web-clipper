"use strict";

var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    http = require('http'),
    inlineCss = require('inline-css'),
    request = require('request');

assert.typeOf('abc', 'string');

describe('inline css tests', function() {
    var options = {
        extraCss: '',
        applyStyleTags: true,
        applyLinkTags: true,
        removeStyleTags: true,
        removeLinkTags: true,
        url: 'http://localhost:8000',
        preserveMediaQueries: true,
        applyWidthAttributes: true,
        removeHtmlSelectors: true
    };

    var close;

    before(function() {
        var server = http.createServer(function(req, res) {
            console.log('req.url=' + req.url); //.toString().replace('\n', ' '));
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end('div { min-width: 480px; }\n');
        });
        var listen = function() { server.listen.apply(server, arguments); };
        close = function(callback) { server.close(callback); };
        listen(8000);
    });

    it('in-page css inlining', function() {
        var html = '<style>div{color:red;}</style><div/>';
        inlineCss(html, options).then(function(result) {
            var expected = '<div style="color: red;"></div>';
            expect(result).to.equal(expected);
        });
    });

    it('remotely linked css inlining', function() {
        //request('http://' + 'localhost:8000' + '/', function(error, response, body) {
        //    console.log('error: ' + error + ', response: ' + response + ', body: ' + body);
        //});
        var html = '<html><head><link rel="stylesheet" href="/foo/bar.css"/><style>div{color:red;}</style></head><body><div></div></body></html>';
        inlineCss(html, options).then(function(result) {
            var expected = '<html><head></head><body><div style="color: red; min-width: 480px;"></div></body></html>';
            expect(result).to.equal(expected);
        });
    });

    after(function() {
        close(function() {
            //console.log('closed server!');
        });
    });
});

