const { Pool, Client } = require('pg');

const client = new Client({
  user: 'jchan',
  host: 'localhost',
  database: 'project_nomad_booking',
  password: '',
  port: 5432,
});

client.connect();

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   client.end();
// });

module.exports = {
  insertListing: (listing) => {
    const insertListingQuery = `INSERT INTO listings (id, avg_rating, review_count, max_adults, max_children,
      max_infants, cleaning_fee, service_fee_perc, occ_tax_rate_perc, additional_guest_fee)
      VALUES (${listing[0]}, ${listing[1]}, ${listing[2]}, ${listing[3]},
      ${listing[4]}, ${listing[5]}, ${listing[6]}, ${listing[7]}, ${listing[8]}, ${listing[9]});`;

    client.query(insertListingQuery, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },

  insertReservation: (reservation) => {
    const insertReservationQuery = `INSERT INTO reservations (id, listing_id, start_date, end_date)
      VALUES (${reservation[0]}, ${reservation[1]}, TO_DATE('${reservation[2]}', 'MM/DD/YYYY'), TO_DATE('${reservation[3]}', 'MM/DD/YYYY'));`;

    client.query(insertReservationQuery, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },

  insertPrice: (price) => {
    const insertPriceQuery = `INSERT INTO listing_daily_prices (id, listing_id, cost_per_night, start_date)
      VALUES (${price[0]}, ${price[1]}, ${price[2]}, TO_DATE('${price[3]}', 'MM/DD/YYYY'));`;

    client.query(insertPriceQuery, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },

  closeConnection: () => {
    client.end();
  },
};
