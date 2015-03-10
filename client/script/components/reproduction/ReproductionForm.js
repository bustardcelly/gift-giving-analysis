/** @jsx React.DOM */
'use strict';
var React = require('react');
var MotifSelector = require('../../view/motif-selector');
var giftStore = require('../../store/gift-store');
var exchangeStore = require('../../store/exchange-store');

var ReproductionListActions = require('../../actions/ReproductionListActions');
var ReproductionAttachmentStore = require('../../stores/ReproductionAttachmentStore');

var InputFormItem = require('../form/InputFormItem');
var TextAreaFormItem = require('../form/TextAreaFormItem');
var CopyOfFormItem = require('../form/CopyOfFormItem');
var SelectFormItem = require('../form/SelectFormItem');
var MotifFormItem = require('../form/MotifFormItem');
var ImageDropBox = require('../form/ImageDropbox');

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
  unpackDay: function(property) {
    var value = parseInt(this.unpack(property));
    return value <= 0 || isNaN(value) ? 'Unknown' : value;
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
  numberFromFieldValue: function($field) {
    return $field.value() < 1 || isNaN(Number($field.value())) ? null : Number($field.value());
  },
  serialize: function() {
    var toCopy = this.props.data;
    var $title = this.refs.titleInput;
    var $copy = this.refs.copyInput;
    var $copyof = this.refs.copyOfInput;
    var $location = this.refs.locationInput;
    var $latitude = this.refs.latitudeInput;
    var $longitude = this.refs.longitudeInput;
    var $locationOriginal = this.refs.locationOriginalInput;
    var $latitudeOriginal = this.refs.latitudeOriginalInput;
    var $longitudeOriginal = this.refs.longitudeOriginalInput;
    var $locationMade = this.refs.locationMadeInput;
    var $latitudeMade = this.refs.latitudeMadeInput;
    var $longitudeMade = this.refs.longitudeMadeInput;
    var $maker = this.refs.makerInput;
    var $publisher = this.refs.publisherInput;
    var $medium = this.refs.mediumInput;
    var $day = this.refs.dayInput;
    var $month = this.refs.monthInput;
    var $year = this.refs.yearInput;
    var $source = this.refs.sourceInput;
    var $notes = this.refs.notesInput;
    var $motifs = this.refs.motifInput;
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
    serialized.latitude = this.numberFromFieldValue($latitude);
    serialized.longitude = this.numberFromFieldValue($longitude);
    serialized.location_original_str = $locationOriginal.value();
    serialized.latitude_original = this.numberFromFieldValue($latitudeOriginal);
    serialized.longitude_original = this.numberFromFieldValue($longitudeOriginal);
    serialized.location_made_str = $locationMade.value();
    serialized.latitude_made = this.numberFromFieldValue($latitudeMade);
    serialized.longitude_made = this.numberFromFieldValue($longitudeMade);
    serialized.maker_author = $maker.value();
    serialized.publisher = $publisher.value();
    serialized.medium = $medium.value();
    serialized.day = this.numberFromFieldValue($day);
    serialized.month = monthList.indexOf($month.value());
    serialized.year = $year.value().length === 0 ? null : $year.value();
    serialized.source = $source.value();
    serialized.notes = $notes.value();
    serialized.motifs = $motifs.value();
    return serialized;
  },
  cancel: function() {
    this.refs.titleInput.revert();
    this.refs.copyInput.revert();
    this.refs.locationInput.revert();
    this.refs.makerInput.revert();
    this.refs.publisherInput.revert();
    this.refs.mediumInput.revert();
    this.refs.dayInput.revert();
    this.refs.monthInput.revert();
    this.refs.yearInput.revert();
    this.refs.latitudeInput.revert();
    this.refs.longitudeInput.revert();
    this.refs.sourceInput.revert();
    this.refs.notesInput.revert();
    this.refs.copyOfInput.revert(this.unpack('copy_of'));
    this.refs.motifInput.revert(this.unpack('motifs'));
  },
  render: function() {
    var attachmentView;
    var titleClass = this.props.title ? '' : 'hidden';

    if(this.props.attachmentsEnabled) {
      attachmentView = (
      <ImageDropBox {... {
        data: this.props.data,
        store: ReproductionAttachmentStore
        }} />
      );
    }

    return (
      <div className="form-group">
        <h3 className={titleClass}>{this.props.title}</h3>
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
          label: 'Location Now',
          placeholder: 'Location Now',
          value: this.unpack('location_str'),
          inputClasses: ['reproduction-location-str-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="latitudeInput" {... {
          name: 'reproduction-latitude-input',
          label: 'Latitude Now',
          placeholder: 'Latitude Now',
          value: this.unpack('latitude'),
          inputClasses: ['reproduction-latitude-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="longitudeInput" {... {
          name: 'reproduction-longitude-input',
          label: 'Longitude Now',
          placeholder: 'Longitude Now',
          value: this.unpack('longitude'),
          inputClasses: ['reproduction-longitude-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="locationOriginalInput" {... {
          name: 'reproduction-location-original-str-input',
          label: 'Location Original',
          placeholder: 'Location Original',
          value: this.unpack('location_original_str'),
          inputClasses: ['reproduction-location-original-str-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="latitudeOriginalInput" {... {
          name: 'reproduction-latitude-original-input',
          label: 'Latitude Original',
          placeholder: 'Latitude Original',
          value: this.unpack('latitude_original'),
          inputClasses: ['reproduction-latitude-original-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="longitudeOriginalInput" {... {
          name: 'reproduction-longitude-original-input',
          label: 'Longitude Original',
          placeholder: 'Longitude Original',
          value: this.unpack('longitude_original'),
          inputClasses: ['reproduction-longitude-original-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="locationMadeInput" {... {
          name: 'reproduction-location-made-str-input',
          label: 'Location Made',
          placeholder: 'Location Made',
          value: this.unpack('location_made_str'),
          inputClasses: ['reproduction-location-made-str-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="latitudeMadeInput" {... {
          name: 'reproduction-latitude-made-input',
          label: 'Latitude Made',
          placeholder: 'Latitude Made',
          value: this.unpack('latitude_made'),
          inputClasses: ['reproduction-latitude-made-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="longitudeMadeInput" {... {
          name: 'reproduction-longitude-made-input',
          label: 'Longitude Made',
          placeholder: 'Longitude Made',
          value: this.unpack('longitude_made'),
          inputClasses: ['reproduction-longitude-made-input'],
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
        <SelectFormItem ref="dayInput" {... {
          name: 'reproduction-day-input',
          label: 'Day',
          value: this.unpackDay('day'),
          options: this.generateDays(),
          inputClasses: ['reproduction-day-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <SelectFormItem ref="monthInput" {... {
          name: 'reproduction-month-input',
          label: 'Month',
          value: this.unpackOnMonthListIndex('month', monthList),
          options: this.generateMonths(),
          inputClasses: ['reproduction-month-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <InputFormItem ref="yearInput" {... {
          name: 'reproduction-year-input',
          label: 'Year',
          placeholder: 'Year',
          value: this.unpack('year'),
          inputClasses: ['reproduction-year-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <MotifFormItem ref="motifInput" {... {
          name: 'motif-checklist',
          label: 'Motif(s)',
          value: this.unpack('motifs'),
          labelClasses: ['reproduction-form-label']
        }} />
        <TextAreaFormItem ref="sourceInput" {... {
          name: 'reproduction-source-input',
          label: 'Source',
          placeholder: 'Source',
          value: this.unpack('source'),
          inputClasses: ['reproduction-source-input'],
          labelClasses: ['reproduction-form-label']
        }} />
        <TextAreaFormItem ref="notesInput" {... {
          name: 'reproduction-notes-input',
          label: 'Notes',
          placeholder: 'Notes',
          value: this.unpack('notes'),
          inputClasses: ['reproduction-notes-input'],
          labelClasses: ['reproduction-form-label']
        }} />
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
        <ReproductionForm ref="reproductionForm" {... formProps} />
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
