/*global $*/
'use strict';
var React = require('react');
var giftDialog = require('./gift-dialog');
var giftService = require('../service/gift');

var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

var GiftListItem = React.createClass({displayName: 'GiftListItem',
  onSaveGift: function(updatedGift) {
    var exchange = this.props.exchange;
    giftService.updateGift(updatedGift)
      .then(function(update) {
        exchange.gifts.update(update);
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

var ExchangeForm = React.createClass({displayName: 'ExchangeForm',
  unpack: function(property) {
    return this.props.data ? 
              this.props.data.hasOwnProperty(property) ? 
                this.props.data[property] 
              : undefined
            : undefined;
  },
  generateDays: function() {
    var days = [React.DOM.option(null, 'Unknown')];
    var i, length = 31;
    for(i = 1; i <= length; i++) {
      days.push(React.DOM.option(null, i));
    }
    return days;
  },
  generateMonths: function() {
    var months = [React.DOM.option(null, 'Unknown')];
    var i, length = monthList.length;
    for(i = 0; i < length; i++) {
      months.push(React.DOM.option(null, monthList[i]));
    }
    return months;
  },
  render: function() {
    return (
      React.DOM.div({
        className: 'form-group'
      },
        React.DOM.h3({
          className: this.props.title ? '' : 'hidden'
        }, this.props.title),
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
            defaultValue: this.unpack('title')
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
            defaultValue: this.unpack('location_str')
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
            defaultValue: this.unpack('source')
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
            defaultValue: this.unpack('description')
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-latitude-input',
            className: 'control-label exchange-form-label'
          }, 'Latitude:'),
          React.DOM.input({
            className: 'form-control input-md exchange-latitude-input',
            type: 'text',
            defaultValue: this.unpack('latitude')
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-longitude-input',
            className: 'control-label exchange-form-label'
          }, 'Longitude:'),
          React.DOM.input({
            className: 'form-control input-md exchange-longitude-input',
            type: 'text',
            defaultValue: this.unpack('longitude')
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-day-input',
            className: 'control-label exchange-form-label'
          }, 'Day:'),
          React.DOM.select({
            id: 'exchange-day-input',
            name: 'exchange-day-input',
            className: 'form-control input-md exchange-day-input',
            defaultValue: this.unpack('day')
          },
            this.generateDays()
          )
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-month-input',
            className: 'control-label exchange-form-label'
          }, 'Month:'),
          React.DOM.select({
            id: 'exchange-day-input',
            name: 'exchange-day-input',
            className: 'form-control input-md exchange-month-input',
            defaultValue: this.unpack('month')
          },
            this.generateMonths()
          )
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'exchange-year-input',
            className: 'control-label exchange-form-label'
          }, 'Year:'),
          React.DOM.input({
            className: 'form-control input-md exchange-year-input',
            type: 'text',
            defaultValue: this.unpack('year')
          })
        )
      )
    );
  }
});

var EditableForm = React.createClass({displayName: 'EditableExchangeForm',
  getInitialState: function() {
    return {
      editable: true
    };
  },
  serializeCopy: function(toCopy) {
    var $dom = this.getDOMNode();
    var $title = $('input.exchange-title-input', $dom);
    var $source = $('input.exchange-source-input', $dom);
    var $location = $('input.exchange-location-str-input', $dom);
    var $description = $('textarea.exchange-description-input', $dom);
    var $latitude = $('input.exchange-latitude-input', $dom);
    var $longitude = $('input.exchange-longitude-input', $dom);
    var serialized = {};
    var key;
    for(key in toCopy) {
      if(toCopy.hasOwnProperty(key) && key !== 'gifts') {
        serialized[key] = toCopy[key];
      }
    }
    serialized.title = $title.val();
    serialized.source = $source.val();
    serialized.location_str = $location.val();
    serialized.description = $description.val();
    serialized.latitude = Number($latitude.val());
    serialized.longitude = Number($longitude.val());
    return serialized;
  },
  handleExchangeSubmit: function(event) {
    event.preventDefault();
    if(this.props.onSubmit) {
      this.props.onSubmit(this.serializeCopy(this.props.data));
    }
    return false;
  },
  handleExchangeCancel: function(event) {
    event.preventDefault();
    var $dom = this.getDOMNode();
    var $title = $('input.exchange-title-input', $dom);
    var $source = $('input.exchange-source-input', $dom);
    var $location = $('input.exchange-location-str-input', $dom);
    var $description = $('textarea.exchange-description-input', $dom);
    var $latitude = $('input.exchange-latitude-input', $dom);
    var $longitude = $('input.exchange-longitude-input', $dom);

    $title.val(this.props.data.title);
    $source.val(this.props.data.source);
    $location.val(this.props.data.location_str);
    $description.val(this.props.data.description);
    $latitude.val(this.props.data.latitude);
    $longitude.val(this.props.data.longitude);
    
    if(this.props.onCancel) {
      this.props.onCancel();
    }
    return false;
  },
  handleExchangeDelete: function(event) {
    event.preventDefault();
    if(this.props.onDelete) {
      this.props.onDelete(this.props.data);
    }
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
        ExchangeForm({
          title: 'Edit Exchange',
          data: this.props.data
        }),
        React.DOM.div({
          className: 'form-group exchange-form-buttonbar'
        },
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-md',
            onClick: this.handleExchangeCancel
          }, 'cancel'),
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-info btn-md',
            onClick: this.handleExchangeSubmit
          }, 'save'),
          React.DOM.button({
            id: 'exchange-submit-button',
            type: 'submit',
            className: 'btn btn-danger btn-md',
            onClick: this.handleExchangeDelete
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
  ExchangeForm: ExchangeForm,
  EditableForm: EditableForm
};
