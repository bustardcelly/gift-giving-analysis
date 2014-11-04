/*global $, window*/
'use strict';

var React = require('react');
var ExchangeForm = require('./exchange-form').ExchangeForm;

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
    var form = {};
    // form.title;
    // form.description;
    // form.location_str;
    // form.source;
    return form;
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
      React.DOM.div({className: this.state.className},
        React.DOM.div({className: 'modal-dialog'},
          React.DOM.div({className: 'modal-content'},
            React.DOM.div({className: 'modal-header'},
              React.DOM.button({
                type:'button', 
                className:'close', 
                'aria-hidden':true,
                'data-dismiss': 'modal',
                onClick: closeDelegate
              }, 'x'),
              React.DOM.h4({className: 'modal-title'}, this.props.title)
            ),
            React.DOM.div({className: 'modal-body'},
              React.DOM.div({
                className: 'form-inline',
                role: 'form',
                action: '#'
              },
                ExchangeForm({
                  title: null, data: null
                })
              )
            ),
            React.DOM.div({className: 'modal-footer'},
              React.DOM.button({
                type:'button', 
                className:'btn btn-default',
                onClick: closeDelegate
              }, 'cancel'),
              React.DOM.button({
                type: 'button',
                className: 'btn btn-info',
                onClick: submitDelegate
              }, 'submit')
            )
          )
        )
      )
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