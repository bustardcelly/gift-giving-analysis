/** @jsx React.DOM */
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
      <li className="gifts-list-item">
        <a href="#" onClick={this.handleEdit}>
          <img className="svg-icon-btn svg-icon-left"
               type="image/svg+xml" 
               width="24" height="24" 
               src="img/edit.svg" />
          <span>({this.props.data.amount }) {this.props.data.kind} : {this.props.data.description}</span>
        </a>
      </li>
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
      <div className="add-gift-title">
        <h3>Gifts:
          <img className="svg-icon-btn add-gift-button svg-icon-right" type="image/svg+xml" width="24" height="24" src="img/add-plus.svg" onClick={this.handleAddGift} />
        </h3>
        <ul className="gifts-list">
          {rows}
        </ul>
      </div>
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
  unpackOnMonthListIndex: function(property, list) {
    var index = this.props.data ? 
                  this.props.data.hasOwnProperty(property) ? 
                    parseInt(this.props.data[property], 10)
                  : undefined
                : undefined;
    if(index < 0 || isNaN(index) || index === undefined) {
      return 'Unknown';
    }
    else {
      return list[index];
    }
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
      <div className="form-group">
        <h3 className={this.props.title ? '' : 'hidden'}>{this.props.title}</h3>
        <div className="form-group">
          <label htmlFor="exchange-title-input" className="control-label exchange-form-label">Title:</label>
          <input type="text" name="exchange-title-input" className="form-control input-md exchange-title-input" placeholder="Title" defaultValue={this.unpack('title')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-location-str-input" className="control-label exchange-form-label">Location:</label>
          <input type="text" name="exchange-location-str-input" className="form-control input-md exchange-location-str-input" placeholder="Location" defaultValue={this.unpack('location_str')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-source-input" className="control-label exchange-form-label">Source:</label>
          <textarea type="text" name="exchange-source-input" className="form-control input-md input-md exchange-source-input" placeholder="Source" defaultValue={this.unpack('source')}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-description-input" className="control-label exchange-form-label">Description:</label>
          <textarea type="text" name="exchange-description-input" className="form-control input-md input-md exchange-description-input" placeholder="Description" defaultValue={this.unpack('description')}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-latitude-input" className="control-label exchange-form-label">Latitude:</label>
          <input type="text" name="exchange-latitude-input" className="form-control input-md input-md exchange-latitude-input" placeholder="Latitude" defaultValue={this.unpack('latitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-longitude-input" className="control-label exchange-form-label">Longitude:</label>
          <input type="text" name="exchange-longitude-input" className="form-control input-md input-md exchange-longitude-input" placeholder="Longitude" defaultValue={this.unpack('longitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-day-input" className="control-label exchange-form-label">Day:</label>
          <select id="exchange-day-input" name="exchange-day-input" className="form-control input-md exchange-day-input" defaultValue={this.unpack('day')}>{this.generateDays()}</select>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-month-input" className="control-label exchange-form-label">Month:</label>
          <select id="exchange-month-input" name="exchange-month-input" className="form-control input-md exchange-month-input" defaultValue={this.unpackOnMonthListIndex('month', monthList)}>{this.generateMonths()}</select>
        </div>
        <div className="form-group">
          <label htmlFor="exchange-year-input" className="control-label exchange-form-label">Year:</label>
          <input type="text" name="exchange-year-input" className="form-control input-md input-md exchange-year-input" placeholder="Year" defaultValue={this.unpack('year')}></input>
        </div>
      </div>
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
    var $source = $('textarea.exchange-source-input', $dom);
    var $location = $('input.exchange-location-str-input', $dom);
    var $description = $('textarea.exchange-description-input', $dom);
    var $latitude = $('input.exchange-latitude-input', $dom);
    var $longitude = $('input.exchange-longitude-input', $dom);
    var $day = $('select.exchange-day-input', $dom);
    var $month = $('select.exchange-month-input', $dom);
    var $year = $('input.exchange-year-input', $dom);
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
    serialized.day = isNaN(Number($day.val())) ? null : Number($day.val());
    serialized.month = monthList.indexOf($month.val());
    serialized.year = $year.val().length === 0 ? null : $year.val();
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
    var $day = $('select.exchange-day-input', $dom);
    var $month = $('select.exchange-month-input', $dom);
    var $year = $('input.exchange-year-input', $dom);

    $title.val(this.props.data.title);
    $source.val(this.props.data.source);
    $location.val(this.props.data.location_str);
    $description.val(this.props.data.description);
    $latitude.val(this.props.data.latitude);
    $longitude.val(this.props.data.longitude);
    $day.val(this.props.data.day);
    $month.val(monthList[this.props.data.month]);
    $year.val(this.props.data.year);

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
      <div className="form-inline" role="form" action="#">
        {
          ExchangeForm({
            title: 'Edit Exchange',
            data: this.props.data
          })
        }
        <div className='form-group exchange-form-buttonbar'>
          <button id="exchange-cancel-button" type="submit" className="btn btn-md" onClick={this.handleExchangeCancel}>cancel</button>
          <button id="exchange-submit-button" type="submit" className="btn btn-info btn-md" onClick={this.handleExchangeSubmit}>save</button>
          <button id="exchange-delete-button" type="submit" className="btn btn-danger btn-md" onClick={this.handleExchangeDelete}>delete</button>
        </div>
        {
          GiftList({
            data: this.props.data
          })
        }
      </div>
    );
  }
});

module.exports = {
  ExchangeForm: ExchangeForm,
  EditableForm: EditableForm
};
