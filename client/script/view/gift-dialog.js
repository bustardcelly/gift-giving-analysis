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
            id: 'gift-kind-input',
            name: 'gift-kind-input',
            className: 'form-control input-md gift-kind-input',
            placeholder: 'Kind',
            type: 'text',
            defaultValue: this.props.isNew ? undefined : this.props.data.kind
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
            id: 'gift-actual-input',
            name: 'gift-actual-input',
            className: 'form-control input-md gift-actual-input',
            type: 'checkbox',
            defaultChecked: this.props.isNew ? false : this.props.data.actual
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
            id: 'gift-amount-input',
            name: 'gift-amount-input',
            className: 'form-control input-md gift-amount-input',
            type: 'number',
            min: 1,
            defaultValue:this.props.isNew ? 0 : this.props.data.amount
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
            id: 'gift-giver-input',
            name: 'gift-giver-input',
            className: 'form-control input-md gift-giver-input',
            placeholder: 'Giver',
            type: 'text',
            defaultValue: this.props.isNew ? undefined : this.props.data.giver
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
            id: 'gift-recipient-input',
            name: 'gift-recipient-input',
            className: 'form-control input-md gift-recipient-input',
            placeholder: 'Recipient',
            type: 'text',
            defaultValue: this.props.isNew ? undefined : this.props.data.recipient
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
            id: 'gift-accepted-input',
            name: 'gift-accepted-input',
            className: 'form-control input-md gift-accepted-input',
            type: 'checkbox',
            defaultChecked: this.props.isNew? false : this.props.data.accepted
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
            id: 'gift-description-input',
            name: 'gift-description-input',
            className: 'form-control input-md gift-description-input',
            placeholder: 'Description...',
            type: 'text',
            defaultValue: this.props.isNew ? undefined : this.props.data.description
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
            id: 'gift-type-input',
            name: 'gift-type-input',
            className: 'form-control input-md gift-type-input',
            defaultValue: this.props.isNew ? 'Official' : this.props.data.type
          }, 
            React.DOM.option(null, 'Official'),
            React.DOM.option(null, 'Personal'),
            React.DOM.option(null, 'Unknown')
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
  serializeCopy: function(toCopy) {
    var $dom = $(this.getDOMNode());
    var serialized = {};
    var key;
    for(key in toCopy) {
      if(toCopy.hasOwnProperty(key)) {
        serialized[key] = toCopy[key];
      }
    }
    serialized.kind = $('#gift-kind-input', $dom).val();
    serialized.amount = parseInt($('#gift-amount-input', $dom).val(), 10);
    serialized.giver = $('#gift-giver-input', $dom).val();
    serialized.recipient = $('#gift-recipient-input', $dom).val();
    serialized.description = $('#gift-description-input', $dom).val();
    serialized.type = $('#gift-type-input', $dom).val();
    serialized.actual = $('#gift-actual-input', $dom).is(":checked");
    serialized.accepted = $('#gift-accepted-input', $dom).is(":checked");
    return serialized;
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
    if(this.props.onSave) {
      this.props.onSave(this.serializeCopy(this.props.data));
    }
    this.hide();
  },
  delete: function(e) {
     if(e) {
      e.stopPropagation();
    }
    if(this.props.onDelete) {
      this.props.onDelete(this.props.data);
    }
    this.hide();
  },
  handleHostEditComplete: function() {
    this.hide();
  },
  render: function() {
    var closeDelegate = this.hide;
    var saveDelegate = this.save;
    var deleteDelegate = this.delete;
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
                isNew: this.props.isNew,
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
              }, 'save'),
              React.DOM.button({
                type: 'button',
                className: 'btn btn-danger ' + (this.props.isNew ? 'hidden' : ''),
                onClick: deleteDelegate
              }, 'delete')
            )
          )
        )
      )
    );
  }
});

module.exports = {
  render: function(giftData, saveResponder, deleteResponder, isNew) {
    var title = isNew ? 'Add Gift to ' + giftData.exchange_title : 'Edit Gift \'' + '(' + giftData.amount + ') ' + giftData.kind + ' : ' + giftData.description + '\'';
    var dialog = Dialog({
      title: title,
      data: giftData,
      isNew: isNew,
      onSave: saveResponder,
      onDelete: deleteResponder
    });
    React.renderComponent(
      dialog,
      window.document.getElementById('gift-dialog')
    );
  }
};