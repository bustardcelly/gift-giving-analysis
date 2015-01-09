/** @jsx React.DOM */
'use strict';
var React = require('react');

var EditableForm = require('./exchange-form').EditableForm;
var exchangeDialog = require('./new-exchange-dialog');
var exchangeService = require('../service/exchange');
var collFactory = require('../model/collection');

var ExchangeListItem = React.createClass({displayName: 'ExchangeListItem',
  onCancel: function() {
    this.setState({
      editing: false
    });
  },
  onSubmit: function(exchangeData) {
    var self = this;
    exchangeService.updateExchange(exchangeData)
      .then(function(update) {
        self.props.data._id = update._id;
        self.props.data._rev = update._rev;
        self.setState({
          editing: false
        });
      }, function(error) {
        // TODO: show error.
      });
  },
  onDelete: function(exchangeData) {
    var self = this;
    var giftCollection = this.props.data.gifts;
    exchangeData.gifts = giftCollection.get();
    exchangeService.deleteExchange(exchangeData)
      .then(function() {
        if(self.props.onDelete) {
          self.props.onDelete(exchangeData);
        }
        self.setState({
          editing: false
        });
      }, function(error) {
        // TODO: show error.
        exchangeData.gifts = giftCollection;
      });
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
    this.props.data.gifts.on('change', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.props.data.gifts.off('change', this._boundForceUpdate);
  },
  render: function() {
    var total = this.props.data.gifts.get().reduce(function(prev, curr, index, array) {
      return prev + parseInt(curr.amount, 10);
    }, 0);
    return (
      <li class="exchange-list-item">
        <p>
          <img className="svg-icon-btn svg-icon-left"
                type="image/svg+xml"
                width="24" height="24"
                src={this.state.editing ? 'img/close.svg' : 'img/open.svg'}
                onClick={this.handleSelect} />
          <a href="#" onClick={this.handleSelect}>{this.props.data.title + ' (' + total + ' gifts)'}</a>
        </p>
        <div className={(this.state.editing ? 'exchange-form' : 'exchange-form hidden')}>
          {
            EditableForm({
              data: this.props.data,
              onCancel: this.onCancel,
              onSubmit: this.onSubmit,
              onDelete: this.onDelete
            })
          }
        </div>
      </li>
    );
  }
});

var ExchangeList = React.createClass({displayName: 'ExchangeList',
  handleExchangeAdd: function() {
    exchangeDialog.render(this.handleSubmitNewExchange);
  },
  handleSubmitNewExchange: function(excgangeData) {
    console.log('Submit new exchange: ' + JSON.stringify(excgangeData, null, 2));
    var list = this.props.list;
    exchangeService.addExchange(excgangeData)
      .then(function(data) {
        data.gifts = collFactory.create();
        list.add(data);
      }, function(error) {
        // TODO: Show error.
      });
  },
  onDeleteExchange: function(exchange) {
    this.props.list.remove(exchange);
  },
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.list.on('change', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.props.list.off('change', this._boundForceUpdate);
  },
  render: function() {
    var deleteDelegate = this.onDeleteExchange;
    var rows = [];
    Array.prototype.forEach.call(this.props.list.get(), function(item) {
      rows.push(
        ExchangeListItem({
          data: item,
          onDelete: deleteDelegate
        })
      );
    });
    return (
      <div>
        <h2 id="exchange-title" class="add-exchange-title">Exchanges:
          <img className="svg-icon-btn add-exchange-button svg-icon-right"
                type="image/svg+xml"
                width="24" height="24"
                src="img/add-plus.svg"
                onClick={this.handleExchangeAdd} />
        </h2>
        <ul className="exchange-list">{rows}</ul>
      </div>
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