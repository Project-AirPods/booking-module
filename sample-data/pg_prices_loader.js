const config = require('../database/config.js');
const { Pool, Client } = require('pg');
const client = new Client(config);

client.connect();

const loadPrices = (endTimer) => {
  var pathToCSV = '/Users/jchan/Code/SDC/project-airpods/booking-module/sample-data/listing_daily_prices.csv';
  const loadPricesQuery = `COPY listing_daily_prices (id,listing_id,cost_per_night,start_date)
  FROM '${pathToCSV}' 
  DELIMITER ',' 
  CSV 
  HEADER;`;

  client.query(loadPricesQuery, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('... inserted entries into database!');
      closeConnection();
      endTimer();
    }
  });
}

const closeConnection = () => {
  client.end();
}

// LOADING MAIN
console.log('\nAttempting to load from prices.csv...');
console.time('... time elapsed');
loadPrices( () => {
  console.timeEnd('... time elapsed');
  console.log('... SUCCESS!');
});