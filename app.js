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

        servers.push({ vi: parseFloat(vi), si: parseFloat(si) });

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

  printHeaders();

  for (var i = 1; i <= n; i++) {

    results[i] = { tempo_de_espera: [], s: 0, n: [], throughput: [], u:[] };
    var total_delay = 0;

    for (var j = 1; j <=m; j++) {

      // Calcula o tempo médio de espera, baseado no último loop
      results[i].tempo_de_espera[j] = (servers[j-1].si ) * (results[i-1].n[j] + 1);

      // Calcula o throughput para a rede
      total_delay += results[i].tempo_de_espera[j] * servers[j-1].vi;
    };

    // Calcula o throughput do sistema e de cada dispositivo
    results[i].s = i / total_delay;

    for (var j = 1; j <=m; j++) {
      results[i].throughput[j] = results[i].s * servers[j-1].vi;
    };

    // Calcula a % de utilização de cada dispositivo e do sistema geral
    for (var j = 1; j <=m; j++) {
      results[i].u[j] = servers[j-1].si * results[i].throughput[j];
    };

    // Calcula o número médio de clientes em cada fila
    for (var j = 1; j <=m; j++) {
      results[i].n[j] = results[i].tempo_de_espera[j] * results[i].throughput[j];
    };

    // console.log(results);


    // printSystemData(i, results[i].s, total_delay);

    for (var j = 1; j <=m; j++) {
      // printComponentData(j, results[i].n[j], results[i].tempo_de_espera[j], results[i].throughput[j], results[i].u[j]);
      printCsvData(i, j, servers[j-1].si, servers[j-1].vi, results[i].n[j], results[i].tempo_de_espera[j], results[i].throughput[j], results[i].u[j], results[i].s, total_delay);
    };

  };
};

var printSystemData = function(nCustomers, sysTruput, totalDelay) {
  console.log("%d Clientes --- X0 = %s cliente/tempo and R = %s sec \n",
    nCustomers, parseFloat(sysTruput).toFixed(3), parseFloat(totalDelay).toFixed(3));
};

var printHeaders = function() {
  console.log("Num. Clientes;M (Dispositivo);Si;Vi;N();R;X;U;X0;R Sistema");
};
var printCsvData = function(i, j, si, vi, n, r, x, u, x0, r_total) {
  console.log("%s;%s;%s;%s;%s;%s;%s;%s;%s;%s;",
    i, j, si, vi, n, r, x, u, x0, r_total);
};

var printComponentData = function(name, length, delay, throughput, utilization) {
  console.log("N[%d] = %s; R[%d] = %s; X[%d] = %s; U[%d] = %s; \n",
    name, parseFloat(length).toFixed(3),
    name, parseFloat(delay).toFixed(3),
    name, parseFloat(throughput).toFixed(3),
    name, parseFloat(utilization).toFixed(3)
    );
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
