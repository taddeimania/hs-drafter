var $ = require('jquery');
var _ = require("underscore");
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');

var CardsView = require('./components/cards.jsx').CardsView;
var CardCollection = require('./models/cards.js').CardCollection;


var cards = new CardCollection();

$(function(){
  cards.fetch().then((response) => {
    ReactDOM.render(
        React.createElement(CardsView, {collection: response}),
        document.getElementById('app')
    );
  });
});
