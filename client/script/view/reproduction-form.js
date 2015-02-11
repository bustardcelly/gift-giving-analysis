/** @jsx React.DOM */
'use strict';
var React = require('react');
var MotifSelector = require('./motif-selector');
var ImageDropBox = require('./image-dropbox');
var giftStore = require('../store/gift-store');
var exchangeStore = require('../store/exchange-store');
var reproductionService = require('../service/reproduction');

var InputFormItem = require('../components/form/InputFormItem');
var CopyOfFormItem = require('../components/form/CopyOfFormItem');

var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

var getGiftNameFromId = function(id) {
  var gift = giftStore.withId(id);
  var exchange;
  if(gift !== undefined) {
    exchange = exchangeStore.withId(gift.exchange_id);
    return [exchange.title, gift.description].join(': ');
  }
  return 'Unknown';
};

var ReproductionForm = React.createClass({displayName: 'ReproductionForm',
  getInitialState: function() {
    return {
      selectedGiftId: undefined
    };
  },
  componentDidMount: function() {
    this.setState({
      selectedGiftId: this.unpack('copy_of')
    });
  },
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
  getOriginalMotifSelection: function() {
    var motifs = this.props.data.motifs;
    return (motifs === null || typeof motifs === 'undefined') ? [] : motifs.split(',');
  },
  getSelectedMotifList: function() {
    var $dom = $(this.getDOMNode());
    var $items = $('#motif-selector .motif-list-item.active', $dom);
    var selectedIds = [];
    $items.each(function() {
      selectedIds.push($(this).data('motifid'));
    });
    return selectedIds.join(',');
  },
  serialize: function() {
    var toCopy = this.props.data;
    var $dom = this.getDOMNode();
    var $title = this.refs.titleInput;
    var $copy = this.refs.copyInput;
    var $copyof = this.refs.copyOfInput;
    var $location = this.refs.locationInput;
    var $maker = this.refs.makerInput;
    var $publisher = this.refs.publisherInput;
    var $medium = this.refs.mediumInput;
    var $day = $('select.reproduction-day-input', $dom);
    var $month = $('select.reproduction-month-input', $dom);
    var $year = $('input.reproduction-year-input', $dom);
    var $latitude = $('input.reproduction-latitude-input', $dom);
    var $longitude = $('input.reproduction-longitude-input', $dom);
    var $source = $('textarea.reproduction-source-input', $dom);
    var $notes = $('textarea.reproduction-notes-input', $dom);
    var serialized = {};
    var key;
    for(key in toCopy) {
      if(toCopy.hasOwnProperty(key) && key !== 'gifts') {
        serialized[key] = toCopy[key];
      }
    }
    serialized.title = $title.value();
    serialized.copy = $copy.value();
    serialized.copy_of = $copyof.value();
    serialized.location_str = $location.value();
    serialized.maker_author = $maker.value();
    serialized.publisher = $publisher.value();
    serialized.medium = $medium.value();
    serialized.day = isNaN(Number($day.val())) ? null : Number($day.val());
    serialized.month = monthList.indexOf($month.val());
    serialized.year = $year.val().length === 0 ? null : $year.val();
    serialized.latitude = Number($latitude.val());
    serialized.longitude = Number($longitude.val());
    serialized.source = $source.val();
    serialized.notes = $notes.val();
    serialized.motifs = this.getSelectedMotifList();
    return serialized;
  },
  revert: function(fieldSelector, property) {
    var $dom = this.getDOMNode();
    var $field = $(fieldSelector, $dom);
    $field.val(this.props.data[property]);
  },
  revertSelectedMotifs: function() {
    var motifs = this.getOriginalMotifSelection();
    var $dom = $(this.getDOMNode());
    var $items = $('#motif-selector .motif-list-item', $dom);
    $items.each(function() {
      var $item = $(this);
      var id = $item.data('motifid');
      $item.removeClass('active');
      if(motifs.indexOf(id) > -1) {
        $item.addClass('active');
      }
    });
  },
  revertSelectedCopyOf: function() {
    var $dom = this.getDOMNode();
    var $elem = $('.reproduction-copy-of-container', $dom);
    var $title = $('p.copy-of-title', $elem);
    $elem.data('copyofid', this.props.data.copy_of);
    $elem.attr('data-copyofid', this.props.data.copy_of);
    $title.text(getGiftNameFromId(this.props.data.copy_of));
  },
  resetSelectedCopyOf: function(value) {
    this.setState({
      selectedGiftId: value
    });
  },
  cancel: function() {
    $(this.refs.titleInput).val(this.props.data['title']);
    $(this.refs.copyInput).val(this.props.data['copy']);
    $(this.refs.locationInput).val(this.props.data['location_str']);
    $(this.refs.makerInput).val(this.props.data['maker_author']);
    $(this.refs.publisherInput).val(this.props.data['publisher']);
    $(this.refs.mediumInput).val(this.props.data['medium']);
    this.revert('input.reproduction-day-input', 'day');
    this.revert('input.reproduction-month-input', 'month');
    this.revert('input.reproduction-year-input', 'year');
    this.revert('input.reproduction-latitude-input', 'latitude');
    this.revert('input.reproduction-longitude-input', 'longitude');
    this.revert('input.reproduction-source-input', 'source');
    this.revert('input.reproduction-notes-input', 'notes');
    this.revertSelectedCopyOf();
    this.revertSelectedMotifs();
    this.resetSelectedCopyOf(this.props.data.copy_of);
  },
  render: function() {
    var attachmentView;

    if(this.props.attachmentsEnabled) {
      attachmentView = (
      <ImageDropBox {... {
          data: this.props.data,
          service: reproductionService
        }} />
      );
    }

    return (
      <div className="form-group">
        <h3 className={this.props.title ? '' : 'hidden'}>{this.props.title}</h3>
        <InputFormItem ref="titleInput" {... {
          name: 'reproduction-title-input',
          label: 'Title',
          placeholder: 'Title',
          value: this.unpack('title'),
          inputClasses: ['reproduction-title-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="copyInput" {... {
          name: 'reproduction-copy-input',
          label: 'Copy',
          placeholder: 'Copy',
          value: this.unpack('copy'),
          inputClasses: ['reproduction-copy-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <CopyOfFormItem ref="copyOfInput" {... {
          giftId: this.unpack('copy_of')
        }} />
        <InputFormItem ref="locationInput" {... {
          name: 'reproduction-location-str-input',
          label: 'Location',
          placeholder: 'Location',
          value: this.unpack('location_str'),
          inputClasses: ['reproduction-location-str-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="makerInput" {... {
          name: 'reproduction-maker-input',
          label: 'Maker/Author',
          placeholder: 'Maker/Author',
          value: this.unpack('maker_author'),
          inputClasses: ['reproduction-maker-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="publisherInput" {... {
          name: 'reproduction-publisher-input',
          label: 'Publisher',
          placeholder: 'Publisher',
          value: this.unpack('publisher'),
          inputClasses: ['reproduction-publisher-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="mediumInput" {... {
          name: 'reproduction-medium-input',
          label: 'Medium',
          placeholder: 'Medium',
          value: this.unpack('medium'),
          inputClasses: ['reproduction-medium-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <div className="form-group">
          <label htmlFor="reproduction-day-input" className="control-label reproduction-form-label">Day:</label>
          <select id="reproduction-day-input" name="reproduction-day-input" className="form-control input-md reproduction-day-input" defaultValue={this.unpack('day')}>{this.generateDays()}</select>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-month-input" className="control-label reproduction-form-label">Month:</label>
          <select id="reproduction-month-input" name="reproduction-month-input" className="form-control input-md reproduction-month-input" defaultValue={this.unpackOnMonthListIndex('month', monthList)}>{this.generateMonths()}</select>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-year-input" className="control-label reproduction-form-label">Year:</label>
          <input type="text" name="reproduction-year-input" className="form-control input-md input-md reproduction-year-input" placeholder="Year" defaultValue={this.unpack('year')}></input>
        </div>
        <div className="form-group">
        <label htmlFor="motif-checklist" className="control-label reproduction-form-label">Motif(s):</label>
        <div id="motif-selector" name="motif-checklist">
          {
            MotifSelector({
              itemClassName: 'motif-list-item',
              selectedMotifs: this.unpack('motifs')
            })
          }
        </div>
      </div>
        <div className="form-group">
          <label htmlFor="reproduction-latitude-input" className="control-label reproduction-form-label">Latitude:</label>
          <input type="text" name="reproduction-latitude-input" className="form-control input-md input-md reproduction-latitude-input" placeholder="Latitude" defaultValue={this.unpack('latitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-longitude-input" className="control-label reproduction-form-label">Longitude:</label>
          <input type="text" name="reproduction-longitude-input" className="form-control input-md input-md reproduction-longitude-input" placeholder="Longitude" defaultValue={this.unpack('longitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-source-input" className="control-label reproduction-form-label">Source:</label>
          <textarea type="text" name="reproduction-source-input" className="form-control input-md input-md reproduction-source-input" placeholder="Source" defaultValue={this.unpack('source')}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-notes-input" className="control-label reproduction-form-label">Notes:</label>
          <textarea type="text" name="reproduction-notes-input" className="form-control input-md input-md reproduction-notes-input" placeholder="Notes" defaultValue={this.unpack('notes')}></textarea>
        </div>
        {
          attachmentView
        }
      </div>
    );
  }
});

var EditableReproductionForm = React.createClass({displayName: 'EditableReproductionForm',
  getInitialState: function() {
    return {
      editable: true
    };
  },
  handleReproductionSubmit: function(event) {
    event.preventDefault();
    if(this.props.onSubmit) {
      this.props.onSubmit(this.refs.reproductionForm.serialize());
    }
    return false;
  },
  handleReproductionCancel: function(event) {
    event.preventDefault();
    this.refs.reproductionForm.cancel();
    if(this.props.onCancel) {
      this.props.onCancel();
    }
    return false;
  },
  handleReproductionDelete: function(event) {
    event.preventDefault();
    if(this.props.onDelete) {
      this.props.onDelete(this.props.data);
    }
    return false;
  },
  render: function() {
    var formProps = {
      title: 'Edit Reproduction',
      data: this.props.data,
      attachmentsEnabled: true
    };
    return (
      <div className="form-inline" role="form" action="#">
        <ReproductionForm {... formProps} ref="reproductionForm" />
        <div className='form-group reproduction-form-buttonbar'>
          <button id="reproduction-cancel-button" type="submit" className="btn btn-md" onClick={this.handleReproductionCancel}>cancel</button>
          <button id="reproduction-submit-button" type="submit" className="btn btn-info btn-md" onClick={this.handleReproductionSubmit}>save</button>
          <button id="reproduction-delete-button" type="submit" className="btn btn-danger btn-md" onClick={this.handleReproductionDelete}>delete</button>
        </div>
      </div>
    );
  }
});

module.exports = {
  ReproductionForm: ReproductionForm,
  EditableReproductionForm: EditableReproductionForm
};
