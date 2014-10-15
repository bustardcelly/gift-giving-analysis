
'use strict';
var React = require('react');

var Form = React.createClass({displayName: 'ExchangeForm', 
  handleSubmit: function(event) {
    event.preventDefault();
    console.log('submit new exchange.');
    return false;
  },
  render: function() {
    return (
      React.DOM.div({
        id: 'exchange-form',
        className: 'form-inline',
        role: 'form',
        action: '#'
      },
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.h3(null, 'New Exchange'),
          React.DOM.input({
            id: "exchange-title-input",
            className: 'form-control input-md',
            placeholder: 'Title',
            type: 'text'
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.input({
            id: "exchange-source-input",
            className: 'form-control input-md',
            placeholder: 'Source',
            type: 'text'
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.textarea({
            id: "exchange-description-input",
            className: 'form-control input-md',
            placeholder: 'Description'
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-success btn-md',
            onClick: this.handleSubmit
          }, 'submit')
        )
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
