/** @jsx React.DOM */
'use strict';
var React = require('react');
var MotifSelector = require('./motif-selector');

var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

var ReproductionForm = React.createClass({displayName: 'ReproductionForm',
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
      <div className="form-inline" role="form" action="#">
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
            <label htmlFor="reproduction-location-str-input" className="control-label reproduction-form-label">Location:</label>
            <input type="text" name="reproduction-location-str-input" className="form-control input-md reproduction-location-str-input" placeholder="Location" defaultValue={this.unpack('location_str')}></input>
          </div>
          <div className="form-group">
            <label htmlFor="reproduction-maker-str-input" className="control-label reproduction-form-label">Maker/Author:</label>
            <input type="text" name="reproduction-maker-str-input" className="form-control input-md reproduction-maker-str-input" placeholder="Maker/Author" defaultValue={this.unpack('maker_author')}></input>
          </div>
          <div className="form-group">
            <label htmlFor="reproduction-publisher-str-input" className="control-label reproduction-form-label">Publisher:</label>
            <input type="text" name="reproduction-publisher-str-input" className="form-control input-md reproduction-publisher-str-input" placeholder="Publisher" defaultValue={this.unpack('publisher')}></input>
          </div>
          <div className="form-group">
            <label htmlFor="reproduction-medium-str-input" className="control-label reproduction-form-label">Medium:</label>
            <input type="text" name="reproduction-medium-str-input" className="form-control input-md reproduction-medium-str-input" placeholder="Medium" defaultValue={this.unpack('medium')}></input>
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
                selectedMotifs: this.props.data.motifs
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
        </div>
      </div>
    );
  }
});

module.exports = {
  ReproductionForm: ReproductionForm,
  render: function(element, data) {
    React.renderComponent(
      ReproductionForm({
        data: data
      }),
      element
    );
  }
};
