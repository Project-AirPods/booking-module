// without clustering
// require('newrelic');
// const app = require('./app.js');

// const PORT = 3001;

// app.listen(PORT, () => console.log(`listening on port ${PORT}!`));



// with clustering
require('newrelic');

var cluster = require('cluster');
const PORT = 3001;

if(cluster.isMaster) {
  var numWorkers = require('os').cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for(var i = 0; i < numWorkers; i++) {
      cluster.fork();
  }

  cluster.on('online', function(worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
      console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
      console.log('Starting a new worker');
      cluster.fork();
  });
} else {
  var app = require('./app.js');
  app.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})

  app.listen(PORT, function() {
      console.log(`Process ${process.pid} is listening to all incoming requests on port ${PORT}!`);
  });
}
