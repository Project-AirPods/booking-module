
DROP DATABASE IF EXISTS project_nomad_booking;
CREATE DATABASE project_nomad_booking;

\c project_nomad_booking;

CREATE TABLE listings (
  id int PRIMARY KEY,
  avg_rating decimal (3, 2),
  review_count int NOT NULL,
  max_adults int NOT NULL,
  max_children int NOT NULL,
  max_infants int NOT NULL,
  cleaning_fee decimal (10, 2) NOT NULL,
  service_fee_perc decimal (3, 2) NOT NULL,
  occ_tax_rate_perc decimal (3, 2) NOT NULL,
  additional_guest_fee decimal(10, 2) NOT NULL
);

CREATE TABLE reservations (
  id int PRIMARY KEY,
  listing_id int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL
);

CREATE TABLE listing_daily_prices (
  id int PRIMARY KEY,
  listing_id int NOT NULL,
  cost_per_night decimal(10, 2) NOT NULL,
  start_date date NOT NULL
);

CREATE INDEX listingsid ON listings (id);
CREATE INDEX reservationsid ON reservations (listing_id);
CREATE INDEX listingdailypricesid ON listing_daily_prices (listing_id);