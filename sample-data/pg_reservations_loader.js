const { Pool, Client } = require('pg');

const client = new Client({
  user: 'jchan',
  host: 'localhost',
  database: 'project_nomad_booking',
  password: '',
  port: 5432,
});

client.connect();

const loadReservations = (endTimer) => {
  var pathToCSV = '/Users/jchan/Code/SDC/project-airpods/booking-module/sample-data/reservations.csv';
  const loadReservationsQuery = `COPY reservations (id,listing_id,start_date,end_date)
  FROM '${pathToCSV}' 
  DELIMITER ',' 
  CSV 
  HEADER;`;

  client.query(loadReservationsQuery, (err) => {
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
console.log('\nAttempting to load from reservations.csv...');
console.time('... time elapsed');
loadReservations( () => {
  console.timeEnd('... time elapsed');
  console.log('... SUCCESS!');
});