'use strict';
var _ = require('lodash');
var React = require('react');

var EditableForm = require('./exchange-form').EditableForm;

var ExchangeListItem = React.createClass({displayName: 'ExchangeListItem',
  onCancel: function() {
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
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.gifts.on("change", this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.props.gifts.off("change", this._boundForceUpdate);
  },
  render: function() {
    var total = this.props.gifts.get().reduce(function(prev, curr, index, array) {
      return prev + curr.amount;
    }, 0);
    return (
      React.DOM.li({
        className: 'exchange-list-item'
      },
        React.DOM.p(null,
          React.DOM.img({
            className: 'svg-icon-btn svg-icon-left',
            type: 'image/svg+xml',
            width: 24,
            height: 24,
            src: this.state.editing ? 'img/close.svg' : 'img/open.svg',
            onClick: this.handleSelect
          }),
          React.DOM.a({
            href: '#',
            onClick: this.handleSelect
          }, this.props.title + ' (' + total + ' gifts)')
        ),
        React.DOM.div({
            className: 'exchange-form ' + (this.state.editing ? '' : 'hidden'),
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
      rows.push(
        ExchangeListItem(item)
      );
    });
    return (
      React.DOM.div(null,
        React.DOM.h2({
          id: 'exchanges-title'
        }, 'Exchanges'),
        React.DOM.ul({
          className: 'exchange-list'
        }, rows)
      )
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