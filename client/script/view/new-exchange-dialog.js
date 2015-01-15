/** @jsx React.DOM */
/*global $, window*/
'use strict';

var React = require('react');
var ExchangeForm = require('./exchange-form').ExchangeForm;

var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

var Dialog = React.createClass({
  getInitialState: function() {
    return {
      className: 'modal fade'
    };
  },
  componentDidMount: function() {
    var $dom = $(this.getDOMNode());
    $dom.modal({
      background:true, show:true
    });
    $dom.on('hidden', function() {
      $dom.off('hidden');
      $dom.remove();
    });
  },
  serializeForm: function() {
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
    return {
      title: $title.val(),
      source: $source.val(),
      location_str: $location.val(),
      description: $description.val(),
      latitude: Number($latitude.val()),
      longitude: Number($longitude.val()),
      day: isNaN(Number($day.val())) ? null : Number($day.val()),
      month: monthList.indexOf($month.val()),
      year: $year.val().length === 0 ? null : $year.val()
    };
  },
  show: function() {
    this.setState({
      className: 'modal fade show'
    });
    setTimeout(function() {
      this.setState({
        className: 'modal fade show in'
      });
    }.bind(this), 0);
  },
  hide: function(e) {
    if(e) {
      e.stopPropagation();
    }
    this.setState({
      className: 'modal fade'
    });
    $(this.getDOMNode()).modal('hide');
  },
  submit: function(e) {
    if(e) {
      e.stopPropagation();
    }
    // TODO: Notify submithandler.
    if(this.props.onSubmit) {
      this.props.onSubmit(this.serializeForm());
    }
    this.hide();
  },
  render: function() {
    var closeDelegate = this.hide;
    var submitDelegate = this.submit;
    return (
      <div className={this.state.className}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-hidden="true" data-dismiss="modal" onClick={closeDelegate}>x</button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              <div className="form-inline" role="form" action="#">
                {
                  ExchangeForm({
                    title: null, data: null
                  })
                }
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={closeDelegate}>cancel</button>
              <button type="button" className="btn btn-info" onClick={submitDelegate}>submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  render: function(submitResponder) {
    var dialog = Dialog({
      title: 'Add New Exchange',
      onSubmit: submitResponder
    });
    React.renderComponent(
      dialog,
      window.document.getElementById('exchange-dialog')
    );
  }
};