
'use strict';
var React = require('react');

var Form = React.createClass({displayName: 'ExchangeForm', 
  render: function() {
    return (
      React.DOM.div(null,
        React.DOM.p(null, 'hello,world')
      )
    );
  }
});

module.exports = {
  element: undefined,
  init: function(element) {
    this.element = element;
    React.renderComponent(
      Form(),
      this.element
    );
  }
};
