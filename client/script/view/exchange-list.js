'use strict';
var _ = require('lodash');
var React = require('react');

var EditableForm = require('./exchange-form').EditableForm;

var ExchangeListItem = React.createClass({displayName: 'ExchangeListItem',
  onCancel: function() {
    console.log('cancelled.');
    this.setState({
      editing: false
    });
  },
  onSubmit: function(exchangeData) {
    console.log('editing? ' + this.state.editing);
    console.log('Send exchange data: ' + JSON.stringify(exchangeData, null, 2));
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  handleSelect: function(event) {
    event.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
    return false;
  },
  render: function() {
    return (
      React.DOM.li(null,
        React.DOM.p(null,
          React.DOM.a({
            href: '#',
            onClick: this.handleSelect
          }, this.props.title)
        ),
        React.DOM.div({
            className: this.state.editing ? '' : 'hidden',
          },
          EditableForm({
            data: this.props,
            onCancel: this.onCancel,
            onSubmit: this.onSubmit
          })
        )
      )
    );
  }
});

var ExchangeList = React.createClass({displayName: 'ExchangeList',
  render: function() {
    var rows = [];
    _.forEach(this.props.list, function(item) {
      rows.push(
        ExchangeListItem(item)
      );
    });
    return (
      React.DOM.ul(null, rows)
    );
  }
});

module.exports = {
  ExchangeList: ExchangeList,
  render: function(element, list) {
    React.renderComponent(
      ExchangeList({
        list: list
      }),
      element
    );
  }
};