import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import PricePerNight from './components/PricePerNight.jsx';
import Rating from './components/Rating.jsx';
import Dates from './components/Dates.jsx';
import Guests from './components/Guests.jsx';
import BookButton from './components/BookButton.jsx';
import GuestPicker from './components/guests/GuestPicker.jsx'
import Calendar from './components/calendar/Calendar.jsx';

const OuterDiv = styled.div`
  width: 376px;
  margin-left: 45px;
`;

const MainDiv = styled.div`
  display: block;
  padding: 24px 24px 24px 24px;
  margin: 16px 0px 24px 0px;
  border: 1px solid #e4e4e4;
  background-color: #ffffff;
  font-family: Helvetica Neue,sans-serif;
  font-size: 14px;
`;

const MarginLine = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #DBDBDB;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listingId: 1,
      costPerNight: 0,
      totalReviews: 0,
      rating: 0,
      stars: [],
    };
  }

  componentDidMount() {
    this.getCoreData();
  }

  getCoreData() {
    axios.get(`/booking/core/listingId/${this.state.listingId}`)
      .then((response) => {
        const listing = response.data[0];
        this.setState({
          costPerNight: listing.avg_cost_per_night,
          totalReviews: listing.review_count,
          rating: listing.avg_rating,
        }, this.getStarArray);
      })
      .catch(error => console.log(error)); // TO DO: what is correct error handling?
  }

  getStarArray() {
    const stars = [];
    // get whole stars
    for (let i = 0; i < Math.floor(this.state.rating); i += 1) {
      stars.push('1');
    }

    if (this.state.rating < 5) {
      // check if half star is needed
      if (this.state.rating % 1 >= 0.5) {
        stars.push('.5');
      } else {
        stars.push('0');
      }

      // fill in rest of array
      while (stars.length < 5) {
        stars.push('0');
      }
    }

    this.setState({ stars: stars });
  }

  render() {
    return (
<<<<<<< HEAD
      <OuterDiv>
        <MainDiv id="app">
          <div id="summary-header">
            <PricePerNight costPerNight={this.state.costPerNight} />
            <Rating stars={this.state.stars} totalReviews={this.state.totalReviews} />
          </div>
          <MarginLine />
          <Dates />
          <Guests />
          <BookButton />
        </MainDiv>
        <GuestPicker />
      </OuterDiv>
=======
      <div>
        <OuterDiv>
          <MainDiv id="app">
            <div id="summary-header">
              <PricePerNight costPerNight={this.state.costPerNight} />
              <Rating stars={this.state.stars} totalReviews={this.state.totalReviews} />
            </div>
            <MarginLine />
            <Dates />
            <Guests />
            <BookButton />
          </MainDiv>
        </OuterDiv>
        <Calendar listingId={this.state.listingId} />
      </div>
>>>>>>> 2581450c31398e56b17cb7b538ba4b17d49abffc
    );
  }
}

ReactDOM.render(<App />, document.getElementById('booking-module'));
