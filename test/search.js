var exec   = require('child_process').execFile;
var expect = require('chai').expect;
var extend = require('util')._extend;
var fs     = require('fs');
var vfs    = require('vinyl-fs');

var SOURCES = './test/fixtures/*.md';
var OUTPUT  = './test/_build';

var CONFIG = {
  template: './test/fixtures/template.html',
  config: {
    'sass': { verbose: false }
  },
  marked: require('./fixtures/marked'),
  handlebars: require('./fixtures/handlebars'),
  silent: true
}

describe('Search Builder', function() {
  var s, data;

  before(function(done) {
    var Super  = require('../index');
    var opts = extend({}, CONFIG);
    opts.src = SOURCES;
    opts.dest = OUTPUT;

    s = Super
      .config(opts)
      .adapter('sass')
      .adapter('js')
      .searchConfig({
        extra: 'test/fixtures/search.yml'
      });

    s.init().on('finish', function() {
      s.buildSearch('test/_build/search.json', function() {
        fs.readFile('test/_build/search.json', function(err, contents) {
          if (err) throw err;
          data = JSON.parse(contents);
          done();
        });
      });
    });
  });

  it('generates search results for processed pages', function() {
    expect(data).to.be.an('array');
    expect(data[0]).to.have.all.keys(['type', 'name', 'description', 'link']);
  });

  it('allows external data to be added as extra results');
});