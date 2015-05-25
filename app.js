var prompt = require('sync-prompt').prompt;
var async = require('async');

var n = 0;         // Número de clientes
var m = 0;         // Número de dispositivos
var servers = [];  // Vetor com os dados dos dispositivos (Si/Vi)
var results = [];


var readValues = function() {

  async.series([
    function(callback) {
      n = prompt('Digite o valor de N: ');
      m = prompt('Digite o valor de M: ');

      callback(null, {n:n, m:m});
    },
    function(callback) {
      for (var i = m; i > 0; i--) {
        var vi = prompt('Digite o valor de Vi para o dispositivo '+i + ': ');
        var si = prompt('Digite o valor de Si para o dispositivo '+i + ': ');

        servers.push({ vi: parseInt(vi), si: parseInt(si) });

        callback(null, servers);
      }
    }
  ]);
};

var initValues = function(callback) {
  results.push({ t: [], s: 0, n: [] });
  for (var i = 1; i <= m; i++) {
    results[0].n[i] = 0;
  };
};

var calcMVA = function(callback) {
  for (var i = 1; i <= n; i++) {

    results[i] = { t: [], s: 0, n: [] };
    var total_delay = 0;

    for (var j = 1; j <=m; j++) {

      // Calcula o tempo médio de espera, baseado no último loop
      results[i].t[j] = (1.0 / servers[j-1].si) * (results[i-1].n[j] + 1.0);

      // Calcula o throughput para a rede
      total_delay += results[i].t[j];
    };

    results[i].s = i / total_delay;

    // Calcula o número médio de clientes em cada fila
    for (var j = 1; j <=m; j++) {
      results[i].n[j] = results[i].s * results[i].t[j];
    };

    // console.log(results);

    printSystemData(i, results[i].s, total_delay);

    for (var j = 1; j <=m; j++) {
      printComponentData(j, results[i].n[j], results[i].t[j])
    };

  };
};

var printSystemData = function(nCustomers, sysTruput, totalDelay) {
  console.log("%d customers --- thruput = %s cust/sec and delay = %s sec \n",
    nCustomers, sysTruput, totalDelay);
};

var printComponentData = function(name, length, delay) {
  console.log("    >>> n[%d] = %s --- t[%d] = %s \n", name, length, name, delay);
}


var main = function() {
  async.series([
    readValues(),
    console.log(servers),
    initValues(),
    calcMVA()
  ]);
};

main();
