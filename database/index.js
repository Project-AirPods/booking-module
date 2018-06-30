const config = require('./config.js');
const { Pool, Client } = require('pg');

const client = new Client(config);
client.connect();

module.exports.getCoreData = function getBaseDataForListing(listingId, callback) {
  const query = `SELECT l.*, ROUND(AVG(p.cost_per_night), 0) as avg_cost_per_night
    FROM listings l
    JOIN listing_daily_prices p ON l.id = p.listing_id
    WHERE l.id = ${listingId}
    GROUP BY 1,2,3,4,5,6,7`;

  client.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      results.rows[0].avg_rating = parseFloat(results.rows[0].avg_rating);
      results.rows[0].cleaning_fee = parseFloat(results.rows[0].cleaning_fee);
      results.rows[0].service_fee_perc = parseFloat(results.rows[0].service_fee_perc);
      results.rows[0].occ_tax_rate_perc = parseFloat(results.rows[0].occ_tax_rate_perc);
      results.rows[0].additional_guest_fee = parseFloat(results.rows[0].additional_guest_fee);
      results.rows[0].avg_cost_per_night = parseFloat(results.rows[0].avg_cost_per_night);
      callback(null, results.rows);
    }
  });
};

module.exports.getReservationData = function getReservationDataForDateRange(listingId, startDate, endDate, callback) {
  const query = `SELECT id, start_date, end_date
    FROM reservations
    WHERE listing_id = ${listingId}
    AND (start_date BETWEEN '${startDate}' AND '${endDate}'
    OR end_date BETWEEN '${startDate}' AND '${endDate}');`;

  client.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
    }
  });
};

const getMaxPrice = function getMaxPrice(listingId, callback) {
  const maxQuery = `SELECT id, start_date, cost_per_night
    FROM listing_daily_prices
    WHERE listing_id = ${listingId}
    ORDER BY start_date DESC LIMIT 1;`;

  client.query(maxQuery, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      for (var i = 0; i < results.rows.length; i++) {
        results.rows[i].cost_per_night = parseFloat(results.rows[i].cost_per_night);
      }
      callback(null, results.rows);
    }
  });
};

module.exports.getPricingData = function getPricingDataForDateRange(listingId, startDate, endDate, callback) {
  const query = `SELECT id, start_date, cost_per_night
    FROM listing_daily_prices
    WHERE listing_id = ${listingId}
    AND start_date < '${endDate}';`;

  client.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length > 0) {
      console.log(results.rows);
      callback(null, results);
    } else { // if no results in date range, just get most recent price
      getMaxPrice(listingId, callback);
    }
  });
};


// POST
module.exports.postReservationData = function postReservationDataForDateRange(listingId, startDate, endDate, callback) {
  
  const idquery = `SELECT id FROM reservations ORDER BY id DESC LIMIT 1;`;

  client.query(idquery, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      const query = `INSERT INTO reservations (id, listing_id, start_date, end_date) 
      VALUES (${results.rows[0].id + 1}, ${listingId}, (to_date('${startDate}', 'YYYY-MM-DD')), (to_date('${endDate}', 'YYYY-MM-DD')));`;  

      client.query(query, (err, results) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results.rows);
        }
      });
    }
  });
};

// DELETE
module.exports.deleteReservationData = function deleteReservationDataForDateRange(listingId, startDate, endDate, callback) {
  
  const query = `DELETE FROM reservations WHERE listing_id = ${listingId} AND start_date = '${startDate}' AND end_date = '${endDate}';`;

  client.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
    }
  });
};

// PUT
module.exports.putReservationData = function putReservationDataForDateRange(listingId, startDate, endDate, newStartDate, newEndDate, callback) {
  
  const query = `UPDATE reservations SET start_date = '${newStartDate}', 
    end_date = '${newEndDate}' WHERE listing_id = ${listingId} AND 
    start_date = '${startDate}' AND 
    end_date = '${endDate}';`;

  client.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
    }
  });
};