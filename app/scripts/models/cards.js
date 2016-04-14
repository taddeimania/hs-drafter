var Backbone = require('backbone');

var Card = Backbone.Model.extend({

});

var CardCollection = Backbone.Collection.extend({
    model: Card,
    url: '/dist/cards.json',
    parse: function(response) {
      return response.Naxxramas;
    }
});

module.exports = {
    'CardCollection': CardCollection
};
