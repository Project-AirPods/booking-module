const express = require('express');
const path = require('path');
const db = require('../database/index.js');

const app = express();

app.use('/', express.static(path.join(__dirname, '/../public')));
app.use('/listings/:listingId', express.static(path.join(__dirname, '/../public')));

app.get('/listings/:listingId/booking/core', (req, res) => {
  db.getCoreData(req.params.listingId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(results);
    }
  });
});

// structure: 127.0.0.1:3001/listings/88/booking/availability/?start_date=2016-08-02&end_date=2019-08-29
app.get('/listings/:listingId/booking/availability', (req, res) => {
  db.getReservationData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(results);
    }
  });
});

// structure: http://localhost:3001/booking/pricing/listingid/3?start_date=2018-07-01&end_date=2018-09-28
app.get('/listings/:listingId/booking/pricing/', (req, res) => {
  db.getPricingData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).send(results);
    }
  });
});

// CREATE RESERVATION
// structure: 127.0.0.1:3001/listings/88/booking/availability/?start_date=2018-06-23&end_date=2018-06-24
app.post('/listings/:listingId/booking/availability', (req, res) => {
  db.postReservationData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).end();
    }
  });
});

// DELETE RESERVATION
// structure: 127.0.0.1:3001/listings/88/booking/availability/?start_date=2018-06-23&end_date=2018-06-24
app.delete('/listings/:listingId/booking/availability', (req, res) => {
  db.deleteReservationData(req.params.listingId, req.query.start_date, req.query.end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).end();
    }
  });
});

// PUT RESERVATION
// structure: 127.0.0.1:3001/listings/88/booking/availability/?start_date=2018-07-01&end_date=2018-09-28&new_start_date=2018-07-02&new_end_date=2018-09-29
app.put('/listings/:listingId/booking/availability', (req, res) => {
  db.putReservationData(req.params.listingId, req.query.start_date, req.query.end_date, req.query.new_start_date, req.query.new_end_date, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(200).end();
    }
  });
});

module.exports = app;
