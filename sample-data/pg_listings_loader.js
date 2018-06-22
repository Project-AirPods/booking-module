const config = require('../database/config.js');
const { Pool, Client } = require('pg');
const client = new Client(config);

client.connect();

const loadListings = (endTimer) => {
  var pathToCSV = '/Users/jchan/Code/SDC/project-airpods/booking-module/sample-data/listings.csv';

  const loadListingsQuery = `COPY listings (id,avg_rating,review_count,max_adults,max_children,max_infants,cleaning_fee,service_fee_perc,occ_tax_rate_perc,additional_guest_fee) 
  FROM '${pathToCSV}' 
  DELIMITER ',' 
  CSV 
  HEADER;`;

  client.query(loadListingsQuery, (err) => {
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
console.log('\nAttempting to load from listings.csv...');
console.time('... time elapsed');
loadListings( () => {
  console.timeEnd('... time elapsed');
  console.log('... SUCCESS!');
});