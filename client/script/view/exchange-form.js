/*global $*/
'use strict';
var React = require('react');
var giftDialog = require('./gift-dialog');
var giftService = require('../service/gift');

var GiftListItem = React.createClass({displayName: 'GiftListItem',
  onSaveGift: function() {
    var exchange = this.props.exchange;
    var gift = this.props.data;
    giftService.updateGift(gift)
      .then(function() {
        exchange.gifts.refresh();
      }, function(error) {
        // TODO: Show error.
      });
  },
  onDeleteGift: function() {
    var exchange = this.props.exchange;
    var gift = this.props.data;
     giftService.deleteGift(gift)
      .then(function() {
        exchange.gifts.remove(gift);
      }, function(error) {
        // TODO: Show error.
      });
  },
  handleEdit: function(event) {
    event.preventDefault();
    giftDialog.render(this.props.data, this.onSaveGift, this.onDeleteGift, false);
    return false;
  },
  render: function() {
    return (
      React.DOM.li({
        className: 'gifts-list-item'
      },
        React.DOM.a({
          href: '#',
          onClick: this.handleEdit
        },
          React.DOM.img({
            className: 'svg-icon-btn svg-icon-left',
            type: 'image/svg+xml',
            width: 24,
            height: 24,
            src: 'img/edit.svg'
          }),
          React.DOM.span(null, '(' + this.props.data.amount + ') ' + this.props.data.kind + ' : ' + this.props.data.description)
        )
      )
    );
  }
});

var GiftList = React.createClass({displayName: 'GiftList',
  onSaveNewGift: function(newGift) {
    var exchange = this.props.data;
    giftService.addGift(exchange._id, newGift)
      .then(function(data) {
        exchange.gifts.add(data);
      }, function(error) {
        // TODO: Show error.
      });
  },
  handleAddGift: function(event) {
    event.preventDefault();
    giftDialog.render({
      exchange_id: this.props.data._id,
      exchange_title: this.props.data.title,
    }, this.onSaveNewGift, null, true);
    return false;
  },
  render: function() {
    var rows = [];
    var exchange = this.props.data;
    Array.prototype.forEach.call(exchange.gifts.get(), function(item) {
      rows.push(
        GiftListItem({
          exchange: exchange,
          data: item
        })
      );
    });
    return (
      React.DOM.div(null,
        React.DOM.h3({
          className: 'add-gift-title'
        }, 'Gifts'),
        React.DOM.img({
          className: 'svg-icon-btn add-gift-button svg-icon-right',
          type: 'image/svg+xml',
          width: '24',
          height: '24',
          src: 'img/add-plus.svg',
          onClick: this.handleAddGift
        }),
        React.DOM.ul({
          className: 'gifts-list'
        }, rows)
      )
    );
  }
});

var EditableForm = React.createClass({displayName: 'ExchangeForm',
  getInitialState: function() {
    return {
      editable: true
    };
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var $dom = this.getDOMNode();
    var $title = $('input.exchange-title-input', $dom);
    var $source = $('input.exchange-source-input', $dom);
    var $location = $('input.exchange-location-str-input', $dom);
    var $description = $('textarea.exchange-description-input', $dom);
    if(this.props.onSubmit) {
      this.props.onSubmit({
        title: $title.val(),
        source: $source.val(),
        description: $description.val(),
        location_str: $location.val()
      });
    }
    return false;
  },
  handleCancel: function(event) {
    event.preventDefault();
    if(this.props.onCancel) {
      this.props.onCancel();
    }
    return false;
  },
  handleDelete: function(event) {
    event.preventDefault();
    console.log('Delete?');
    return false;
  },
  render: function() {
    var type = this.props.isNew ? 'Create' : 'Edit';
    return (
      React.DOM.div({
        className: 'form-inline',
        role: 'form',
        action: '#'
      },
        React.DOM.h3(null, [type, 'Exchange'].join(' ')),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-title-input',
            className: 'control-label exchange-form-label'
          }, 'Title:'),
          React.DOM.input({
            name: 'exchange-title-input',
            className: 'form-control input-md exchange-title-input',
            placeholder: 'Title',
            type: 'text',
            defaultValue: this.props.data.title ? this.props.data.title : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-location-str-input',
            className: 'control-label exchange-form-label'
          }, 'Location:'),
          React.DOM.input({
            name: 'exchange-location-str-input',
            className: 'form-control input-md exchange-location-str-input',
            placeholder: 'Location',
            type: 'text',
            defaultValue: this.props.data.location_str ? this.props.data.location_str : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-source-input',
            className: 'control-label exchange-form-label'
          }, 'Source:'),
          React.DOM.input({
            className: 'form-control input-md exchange-source-input',
            placeholder: 'Source',
            type: 'text',
            defaultValue: this.props.data.source ? this.props.data.source : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-description-input',
            className: 'control-label exchange-form-label'
          }, 'Description:'),
          React.DOM.textarea({
            className: 'form-control input-md exchange-description-input',
            placeholder: 'Description',
            defaultValue: this.props.data.description ? this.props.data.description : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group exchange-form-buttonbar'
        },
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-md',
            onClick: this.handleCancel
          }, 'cancel'),
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-info btn-md',
            onClick: this.handleSubmit
          }, 'save'),
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-danger btn-md',
            onClick: this.handleDelete
          }, 'delete')
        ),
        GiftList({
          data: this.props.data
        })
      )
    );
  }
});

module.exports = {
  EditableForm: EditableForm,
  render: function(element, exchangeData) {
    React.renderComponent(
      EditableForm({
        isNew: typeof exchangeData === 'undefined',
        data: exchangeData
      }),
      element
    );
  }
};
