// run: node sample-data/generator.js

const fs = require('fs');
var execSync = require('child_process').execSync;

// helpers
const getRandomInt = function getRandomIntegerBetweenValues(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
};

const getRandomDecimal = function getRandomDecimalBetweenValues(min, max, decimalPlace) {
  const rand = (Math.random() * (max - min)) + min;
  const power = Math.pow(10, decimalPlace);
  return Math.floor(rand * power) / power;
};

const getRandomPosNeg = function getRandomPositiveOrNegative() {
  return Math.random() >= 0.5 ? 1 : -1;
};

const getDateString = function getDateStringForSQLInsertion(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};


// generating listings
const listingsToCSV = function (n = 100) {

  var categories = 'id,avg_rating,review_count,max_adults,max_children,max_infants,cleaning_fee,service_fee_perc,occ_tax_rate_perc,additional_guest_fee\n';
  fs.writeFileSync('./listings.csv', categories, 'utf8');

  var listings = [];
  for (let i = 0; i < n; i += 1) {
    const row = [];

    row.push(i + 1); // index
    row.push(getRandomDecimal(2, 5, 1)); // average_rating
    row.push(getRandomInt(10, 500)); // review_count
    row.push(getRandomInt(2, 20)); // max_adults
    row.push(getRandomInt(2, 6)); // max_children
    row.push(getRandomInt(2, 6)); // max_infants
    row.push(getRandomInt(0, 80)); // cleaning_fee
    row.push(getRandomDecimal(0, 0.4, 2)); // service_fee_perc
    row.push(getRandomDecimal(0, 0.4, 2)); // occ_tac_rate_perc
    row.push(getRandomInt(0, 50)); // additional_guest_fee

    listings.push(row);

    if (i % 500000 === 0) {
      var section = listings.join('\n') + '\n';
      fs.appendFileSync('./listings.csv', section, 'utf8');
      listings = [];
    }
  }
  return true;
}

console.log('\nAttempting to generate listingsToCSV...');
console.time('... time elapsed');
if (listingsToCSV(10000001)) { // generate 10,000,000 listings
  console.timeEnd('... time elapsed');
  var total = execSync('wc -l listings.csv').toString().split(' ');
  console.log(`... SUCCESS: ${total[total.length - 2]} lines generated!`);
} else {
  console.timeEnd('... time elapsed');
  console.log('... FAILURE!');
}




// generate reservations
const reservationsToCSV = function (n = 100) {

  var categories = 'id,listing_id,start_date,end_date\n';
  fs.writeFileSync('./reservations.csv', categories, 'utf8');

  var reservations = [];
  const startDate = new Date(2018, 5, 15);

  let rowNum = 1;

  for (let i = 0; i < n; i += 1) {
    // const reservationsForListing = getRandomInt(10, 50);
    const reservationsForListing = getRandomInt(3, 5);
    const nextReservation = new Date(startDate);
    nextReservation.setDate(startDate.getDate() + getRandomInt(0, 10));

    for (let j = 0; j < reservationsForListing; j += 1) {
      const endOfReservation = new Date(nextReservation);
      endOfReservation.setDate(nextReservation.getDate() + getRandomInt(1, 10));

      const row = [rowNum, i + 1, getDateString(nextReservation), getDateString(endOfReservation)];
      reservations.push(row);

      rowNum += 1;
      nextReservation.setDate(endOfReservation.getDate() + getRandomInt(0, 10));
    }

    if (i % 100000 === 0) {
      var section = reservations.join('\n') + '\n';
      fs.appendFileSync('./reservations.csv', section, 'utf8');
      reservations = [];
    }
  }

  return true;
}

console.log('\nAttempting to generate reservationsToCSV...');
console.time('... time elapsed');
if (reservationsToCSV(10000001)) { // generate 10,000,000 reservations
  console.timeEnd('... time elapsed');
  var total = execSync('wc -l reservations.csv').toString().split(' ');
  console.log(`... SUCCESS: ${total[total.length - 2]} lines generated!`);
} else {
  console.timeEnd('... time elapsed');
  console.log('... FAILURE!');
}




// generate daily prices
const dailyPricesToCSV = function (n = 100) {

  var categories = 'index,listing_id,cost_per_night,start_date\n';
  fs.writeFileSync('./listing_daily_prices.csv', categories, 'utf8');
  
  const priceStartDate = new Date(2018, 5, 1);
  var dailyPrices = [];
  rowNum = 1;
  
  for (let i = 0; i < n; i += 1) {
    // const priceChangesForListing = getRandomInt(5, 10);
    const priceChangesForListing = getRandomInt(3, 5);
    const nextDate = new Date(priceStartDate);
    let nextPrice = getRandomInt(45, 500);
  
    for (let j = 0; j < priceChangesForListing; j += 1) {
      const row = [];
  
      row.push(rowNum); // index
      row.push(i + 1); // listing_id
      row.push(nextPrice); // cost_per_night
      row.push(getDateString(nextDate)); // start_date
  
      dailyPrices.push(row);
      rowNum += 1;
  
      const potentialNextPrice = nextPrice + (getRandomInt(0, 50) * getRandomPosNeg());
      nextPrice = potentialNextPrice > 45 ? potentialNextPrice : 45;
      nextDate.setDate(nextDate.getDate() + getRandomInt(10, 50));
    }

    if (i % 500000 === 0) {
      var section = dailyPrices.join('\n') + '\n';
      fs.appendFileSync('./listing_daily_prices.csv', section, 'utf8');
      dailyPrices = [];
    }
  }

  return true;
}

console.log('\nAttempting to generate dailyPricesToCSV...');
console.time('... time elapsed');
if (dailyPricesToCSV(10000001)) { // generate 10,000,000 prices
  console.timeEnd('... time elapsed');
  var total = execSync('wc -l listing_daily_prices.csv').toString().split(' ');
  console.log(`... SUCCESS: ${total[total.length - 2]} lines generated!`);
} else {
  console.timeEnd('... time elapsed');
  console.log('... FAILURE!');
}