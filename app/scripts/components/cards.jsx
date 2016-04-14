var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var LinkedStateMixin = require('react/lib/LinkedStateMixin');
require('backbone-react-component');

let HEROES = [
  {"cardClass": "Rogue", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_03.png"},
  {"cardClass": "Paladin", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_04.png"},
  {"cardClass": "Shaman", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_02.png"},
  {"cardClass": "Hunter", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_05.png"},
  {"cardClass": "Druid", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_06.png"},
  {"cardClass": "Mage", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_08.png"},
  {"cardClass": "Warlock", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_07.png"},
  {"cardClass": "Warrior", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_01.png"},
  {"cardClass": "Priest", "card": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/HERO_09.png"}
]


let Hero = React.createClass({
  pickHero(e) {
    e.preventDefault();
    this.props.pickHero(this.props.hero.cardClass);
  },
  render() {
    return (
      <div className="col-sm-3" onClick={this.pickHero}>
          <img className="hero" src={this.props.hero.card} />
      </div>
    )
  }
});

let Card = React.createClass({
  pickCard(e) {
    e.preventDefault();
    this.props.pickCard(this.props.index);
  },
  render() {
    return (
      <div className="col-sm-3" onClick={this.pickCard}>
          <img className="card" src={this.props.card.img} />
      </div>
    )
  }
});

let CardsView = React.createClass({
    mixins: [Backbone.React.Component.Mixin, LinkedStateMixin],
    getInitialState() {
      return {
        deck: [],
        hero: undefined,
        draftList: []
      };
    },
    pickHero(cardClass) {
      let doubleList = [].concat(this.getCards(cardClass), this.getCards(cardClass));
      this.setState({hero: cardClass, draftList: doubleList});
    },
    pickCard(id) {
      var deck = this.state.deck;
      var card = this.state.draftList.splice(id, 1)[0];
      deck.push(card);
      var newList = _.sortBy(deck, function (card) { return card.cost });
      this.setState({draftList: _.shuffle(this.state.draftList), deck: newList});
    },
    getCards(playerClass) {
      return _.shuffle(this.props.collection["Basic"].filter(function(card) {
        return card.collectible && card.cost != undefined && (card.playerClass == playerClass || card.playerClass == undefined);
      }.bind(this)));
    },
    render() {
      if (!this.state.hero){
        var cards = HEROES.map(function(hero, index){
           return (
             <Hero index={index} hero={hero} key={index} pickHero={this.pickHero}/>
           )
        }.bind(this));
        var currentDeck = []
      } else {
        if (this.state.deck.length >= 30){
          var cards = (
            <div className="col-sm-4">Jobs Done</div>
          )
        } else {
          var cards = this.state.draftList.slice(0, 3).map(function(card, index){
            return (
              <Card index={index} card={card} key={index} pickCard={this.pickCard}/>
            );
          }.bind(this));
        }

        var currentDeck = this.state.deck.map(function(card, index){
          return (
            <li key={index}>({card.cost}) {card.name}</li>
          )
        });
      }


      return (
        <div>
        <h1>{this.state.hero}</h1>
          <div className="row">
            {cards}
            <div className="col-sm-3 deck">
              {currentDeck.length} / 30
              <ul>
                {currentDeck}
              </ul>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = {
    'CardsView': CardsView
};
