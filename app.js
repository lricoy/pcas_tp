var prompt = require('sync-prompt').prompt;
var async = require('async');

var n = 0;
var m = 0;

var servers = [];

var readValues = function() {

  async.series([
    function(callback) {
      n = prompt('Digite o valor de N: ');
      m = prompt('Digite o valor de M: ');

      callback(null, {n:n, m:m});
    },
    function(callback) {
      for (var i = n; i > 0; i--) {
        var vi = prompt('Digite o valor de Vi para o dispositivo '+i + ': ');
        var si = prompt('Digite o valor de Si para o dispositivo '+i + ': ');

        servers.push({ vi: vi, si: si });

        callback(null, {n:n, m:m});
      }
    }
  ]);
};



var main = function() {
  async.series([
    readValues(),
    console.log(servers)
  ]);
};

main();
