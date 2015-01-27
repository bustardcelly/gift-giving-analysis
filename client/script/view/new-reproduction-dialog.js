/** @jsx React.DOM */
/*global $, window*/
'use strict';
var React = require('react');
var ReproductionForm = require('./reproduction-form').ReproductionForm;

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
    return this.refs.reproductionForm.serialize();
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
                <ReproductionForm ref="reproductionForm" {... {
                    title: null, 
                    data: null
                  }} />
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
      title: 'Add New Reproduction',
      onSubmit: submitResponder
    });
    React.renderComponent(
      dialog,
      window.document.getElementById('reproduction-dialog')
    );
  }
};