/** @jsx React.DOM */
'use strict';
var React = require('react');
var MotifSelector = require('./motif-selector');
var ImageDropBox = require('./image-dropbox');
var giftStore = require('../store/gift-store');
var exchangeStore = require('../store/exchange-store');
var reproductionService = require('../service/reproduction');

var copyOfGiftDialog = require('./copyof-selector-dialog');

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
  numberFromFieldValue: function($field) {
    return ($field.val().length < 1 || isNaN(Number($field.val()))) ? null : Number($field.val());
  },
  serialize: function() {
    var toCopy = this.props.data;
    var $dom = this.getDOMNode();
    var $title = $('input.reproduction-title-input', $dom);
    var $copy = $('input.reproduction-copy-input', $dom);
    var $copyof = $('.reproduction-copy-of-container', $dom);
    var $location = $('input.reproduction-location-str-input', $dom);
    var $latitude = $('input.reproduction-latitude-input', $dom);
    var $longitude = $('input.reproduction-longitude-input', $dom);
    var $locationOriginal = $('input.reproduction-location-original-str-input', $dom);
    var $latitudeOriginal = $('input.reproduction-latitude-original-input', $dom);
    var $longitudeOriginal = $('input.reproduction-longitude-original-input', $dom);
    var $locationMade = $('input.reproduction-location-made-str-input', $dom);
    var $latitudeMade = $('input.reproduction-latitude-made-input', $dom);
    var $longitudeMade = $('input.reproduction-longitude-made-input', $dom);
    var $maker = $('input.reproduction-maker-input', $dom);
    var $publisher = $('input.reproduction-publisher-input', $dom);
    var $medium = $('input.reproduction-medium-input', $dom);
    var $day = $('select.reproduction-day-input', $dom);
    var $month = $('select.reproduction-month-input', $dom);
    var $year = $('input.reproduction-year-input', $dom);
    var $source = $('textarea.reproduction-source-input', $dom);
    var $notes = $('textarea.reproduction-notes-input', $dom);
    var serialized = {};
    var key;
    for(key in toCopy) {
      if(toCopy.hasOwnProperty(key) && key !== 'gifts') {
        serialized[key] = toCopy[key];
      }
    }
    serialized.title = $title.val();
    serialized.copy = $copy.val();
    serialized.copy_of = $copyof.attr('data-copyofid');
    serialized.location_str = $location.val();
    serialized.latitude = this.numberFromFieldValue($latitude);
    serialized.longitude = this.numberFromFieldValue($longitude);
    serialized.location_original_str = $locationOriginal.val();
    serialized.latitude_original = this.numberFromFieldValue($latitudeOriginal);
    serialized.longitude_original = this.numberFromFieldValue($longitudeOriginal);
    serialized.location_made_str = $locationMade.val();
    serialized.latitude_made = this.numberFromFieldValue($latitudeMade);
    serialized.longitude_made = this.numberFromFieldValue($longitudeMade);
    serialized.maker_author = $maker.val();
    serialized.publisher = $publisher.val();
    serialized.medium = $medium.val();
    serialized.day = isNaN(Number($day.val())) ? null : Number($day.val());
    serialized.month = monthList.indexOf($month.val());
    serialized.year = $year.val().length === 0 ? null : $year.val();
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
    this.revert('input.reproduction-title-input', 'title');
    this.revert('input.reproduction-copy-input', 'copy');
    this.revert('input.reproduction-location-str-input', 'location_str');
    this.revert('input.reproduction-latitude-input', 'latitude');
    this.revert('input.reproduction-longitude-input', 'longitude');
    this.revert('input.reproduction-location-original-str-input', 'location_original_str');
    this.revert('input.reproduction-latitude-original-input', 'latitude_original');
    this.revert('input.reproduction-longitude-original-input', 'longitude_original');
    this.revert('input.reproduction-location-made-str-input', 'location_made_str');
    this.revert('input.reproduction-latitude-made-input', 'latitude_made');
    this.revert('input.reproduction-longitude-made-input', 'longitude_made');
    this.revert('input.reproduction-maker-input', 'maker_str');
    this.revert('input.reproduction-publisher-input', 'publisher');
    this.revert('input.reproduction-medium-input', 'medium');
    this.revert('input.reproduction-day-input', 'day');
    this.revert('input.reproduction-month-input', 'month');
    this.revert('input.reproduction-year-input', 'year');
    this.revert('input.reproduction-source-input', 'source');
    this.revert('input.reproduction-notes-input', 'notes');
    this.revertSelectedCopyOf();
    this.revertSelectedMotifs();
    this.resetSelectedCopyOf(this.props.data.copy_of);
  },
  onSaveCopyOfGift: function(selectedGiftId) {
    this.setState({
      selectedGiftId: selectedGiftId
    });
  },
  handleChangeCopyOf: function(event) {
    event.preventDefault();
    copyOfGiftDialog.render(this.state.selectedGiftId, this.onSaveCopyOfGift);
    return false;
  },
  render: function() {
    var attachmentView = '';

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
        <div className="form-group">
          <label htmlFor="reproduction-title-input" className="control-label reproduction-form-label">Title:</label>
          <input type="text" name="reproduction-title-input" className="form-control input-md reproduction-title-input" placeholder="Title" defaultValue={this.unpack('title')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-copy-input" className="control-label reproduction-form-label">Copy:</label>
          <input type="text" name="reproduction-copy-input" className="form-control input-md reproduction-copy-input" placeholder="Copy" defaultValue={this.unpack('copy')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-copy-of-input" className="control-label reproduction-form-label">Copy Of:</label>
          <div name="reproduction-copy-of-input" className="form-control reproduction-copy-of-container" data-copyofid={this.state.selectedGiftId}>
            <p className="copy-of-title">{getGiftNameFromId(this.state.selectedGiftId)}</p>
            <button type="button" className="btn" onClick={this.handleChangeCopyOf}>Change</button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-location-str-input" className="control-label reproduction-form-label">Location Now:</label>
          <input type="text" name="reproduction-location-str-input" className="form-control input-md reproduction-location-str-input" placeholder="Location" defaultValue={this.unpack('location_str')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-latitude-input" className="control-label reproduction-form-label">Latitude Now:</label>
          <input type="text" name="reproduction-latitude-input" className="form-control input-md input-md reproduction-latitude-input" placeholder="Latitude" defaultValue={this.unpack('latitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-longitude-input" className="control-label reproduction-form-label">Longitude Now:</label>
          <input type="text" name="reproduction-longitude-input" className="form-control input-md input-md reproduction-longitude-input" placeholder="Longitude" defaultValue={this.unpack('longitude')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-location-original-str-input" className="control-label reproduction-form-label">Location Original:</label>
          <input type="text" name="reproduction-location-original-str-input" className="form-control input-md reproduction-location-original-str-input" placeholder="Location Original" defaultValue={this.unpack('location_original_str')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-latitude-original-input" className="control-label reproduction-form-label">Latitude Original:</label>
          <input type="text" name="reproduction-latitude-original-input" className="form-control input-md input-md reproduction-latitude-original-input" placeholder="Latitude Original" defaultValue={this.unpack('latitude_original')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-longitude-original-input" className="control-label reproduction-form-label">Longitude Original:</label>
          <input type="text" name="reproduction-longitude-original-input" className="form-control input-md input-md reproduction-longitude-original-input" placeholder="Longitude Original" defaultValue={this.unpack('longitude_original')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-location-made-str-input" className="control-label reproduction-form-label">Location Made:</label>
          <input type="text" name="reproduction-location-made-str-input" className="form-control input-md reproduction-location-made-str-input" placeholder="Location Made" defaultValue={this.unpack('location_made_str')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-latitude-made-input" className="control-label reproduction-form-label">Latitude Made:</label>
          <input type="text" name="reproduction-latitude-made-input" className="form-control input-md input-md reproduction-latitude-made-input" placeholder="Latitude Made" defaultValue={this.unpack('latitude_made')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-longitude-made-input" className="control-label reproduction-form-label">Longitude Made:</label>
          <input type="text" name="reproduction-longitude-made-input" className="form-control input-md input-md reproduction-longitude-made-input" placeholder="Longitude Made" defaultValue={this.unpack('longitude_made')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-maker-input" className="control-label reproduction-form-label">Maker/Author:</label>
          <input type="text" name="reproduction-maker-input" className="form-control input-md reproduction-maker-input" placeholder="Maker/Author" defaultValue={this.unpack('maker_author')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-publisher-input" className="control-label reproduction-form-label">Publisher:</label>
          <input type="text" name="reproduction-publisher-input" className="form-control input-md reproduction-publisher-input" placeholder="Publisher" defaultValue={this.unpack('publisher')}></input>
        </div>
        <div className="form-group">
          <label htmlFor="reproduction-medium-input" className="control-label reproduction-form-label">Medium:</label>
          <input type="text" name="reproduction-medium-input" className="form-control input-md reproduction-medium-input" placeholder="Medium" defaultValue={this.unpack('medium')}></input>
        </div>
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
