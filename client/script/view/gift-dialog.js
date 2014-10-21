/*global window, $*/
'use strict';
var React = require('react');

var HostBody = React.createClass({
  render: function() {
    return (
      React.DOM.div({
        id: 'exchange-form',
        className: 'form-inline',
        role: 'form',
        action: '#'
      },
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-kind-input',
            className: 'control-label exchange-form-label'
          }, 'Kind:'),
          React.DOM.input({
            name: 'gift-kind-input',
            className: 'form-control input-md gift-kind-input',
            placeholder: 'Kind',
            type: 'text',
            defaultValue: this.props.data.kind ? this.props.data.kind : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-actual-input',
            className: 'control-label exchange-form-label'
          }, 'Is Actual:'),
          React.DOM.input({
            name: 'gift-actual-input',
            className: 'form-control input-md gift-actual-input',
            type: 'checkbox',
            defaultChecked: this.props.data.actual
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-amount-input',
            className: 'control-label exchange-form-label'
          }, 'Amount Given:'),
          React.DOM.input({
            name: 'gift-amount-input',
            className: 'form-control input-md gift-amount-input',
            type: 'number',
            min: 1,
            defaultValue: this.props.data.amount ? this.props.data.amount : 0
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-giver-input',
            className: 'control-label exchange-form-label'
          }, 'Giver:'),
          React.DOM.input({
            name: 'gift-giver-input',
            className: 'form-control input-md gift-giver-input',
            placeholder: 'Giver',
            type: 'text',
            defaultValue: this.props.data.giver ? this.props.data.giver : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-recipient-input',
            className: 'control-label exchange-form-label'
          }, 'Recipient:'),
          React.DOM.input({
            name: 'gift-recipient-input',
            className: 'form-control input-md gift-recipient-input',
            placeholder: 'Recipient',
            type: 'text',
            defaultValue: this.props.data.recipient ? this.props.data.recipient : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-accepted-input',
            className: 'control-label exchange-form-label'
          }, 'Is Accepted:'),
          React.DOM.input({
            name: 'gift-accepted-input',
            className: 'form-control input-md gift-accepted-input',
            type: 'checkbox',
            defaultChecked: this.props.data.accepted
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-description-input',
            className: 'control-label exchange-form-label'
          }, 'Description:'),
          React.DOM.textarea({
            name: 'gift-description-input',
            className: 'form-control input-md gift-description-input',
            placeholder: 'Description...',
            type: 'text',
            defaultValue: this.props.data.description ? this.props.data.description : undefined
          })
        ),
        React.DOM.div({
          className: 'form-group'
        },
          React.DOM.label({
            htmlFor: 'gift-type-input',
            className: 'control-label exchange-form-label'
          }, 'Type:'),
          React.DOM.select({
            name: 'gift-type-input',
            className: 'form-control input-md gift-type-input',
            defaultValue: this.props.data.type ? this.props.data.type : 'Official'
          }, 
            React.DOM.option(null, 'Official'),
            React.DOM.option(null, 'Personal')
          )
        )
      )
    );
  }
});

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
  save: function(e) {
    if(e) {
      e.stopPropagation();
    }
    console.log('Save.');
    this.hide();
  },
  handleHostEditComplete: function() {
    this.hide();
  },
  render: function() {
    var closeDelegate = this.hide;
    var saveDelegate = this.save;
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
              HostBody({
                data: this.props.data,
                onComplete: this.handleHostEditComplete
              })
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
                onClick: saveDelegate
              }, 'save')
            )
          )
        )
      )
    );
  }
});

module.exports = {
  render: function(title, exchangeData) {
    var dialog = Dialog({
      title: title,
      data: exchangeData
    });
    React.renderComponent(
      dialog,
      window.document.getElementById('gift-dialog')
    );
  }
};