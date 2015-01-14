/** @jsx React.DOM */
/*global window, $*/
'use strict';
var React = require('react');
var MotifSelector = require('./motif-selector');

var HostBody = React.createClass({
  render: function() {
    return (
      <div id="gift-form" className="form-inline" role="form" action="#">
        <div className="form-group">
          <label htmlFor="gift-kind-input" className="control-label exchange-form-label">Kind:</label>
          <input id="gift-kind-input"
                  name="gift-kind-input" 
                  className="form-control input-md gift-kind-input" 
                  type="text" placeholder="Kind" 
                  defaultValue={this.props.isNew ? undefined : this.props.data.kind} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-actual-input" className="control-label exchange-form-label">Is Actual:</label>
          <input id="gift-actual-input"
                  name="gift-actual-input" 
                  className="form-control input-md gift-actual-input" 
                  type="checkbox"
                  defaultChecked={this.props.isNew ? false : this.props.data.actual} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-amount-input" className="control-label exchange-form-label">Amount Given::</label>
          <input id="gift-amount-input"
                  name="gift-amount-input" 
                  className="form-control input-md gift-amount-input" 
                  type="number" min="1" 
                  defaultValue={this.props.isNew ? undefined : this.props.data.amount} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-giver-input" className="control-label exchange-form-label">Giver:</label>
          <input id="gift-giver-input"
                  name="gift-giver-input" 
                  className="form-control input-md gift-giver-input" 
                  type="text" placeholder="Giver" 
                  defaultValue={this.props.isNew ? undefined : this.props.data.giver} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-recipient-input" className="control-label exchange-form-label">Recipient:</label>
          <input id="gift-recipient-input"
                  name="gift-recipient-input" 
                  className="form-control input-md gift-recipient-input" 
                  type="text" placeholder="Recipient" 
                  defaultValue={this.props.isNew ? undefined : this.props.data.recipient} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-accepted-input" className="control-label exchange-form-label">Is Accepted:</label>
          <input id="gift-accepted-input"
                  name="gift-accepted-input" 
                  className="form-control input-md gift-accepted-input" 
                  type="checkbox"
                  defaultChecked={this.props.isNew ? false : this.props.data.accepted} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-description-input" className="control-label exchange-form-label">Description:</label>
          <textarea id="gift-description-input"
                  name="gift-description-input" 
                  className="form-control input-md gift-description-input" 
                  type="text" placeholder="Description..."
                   defaultValue={this.props.isNew ? false : this.props.data.description} />
        </div>
        <div className="form-group">
          <label htmlFor="gift-type-input" className="control-label exchange-form-label">Type:</label>
          <select id="gift-type-input"
                  name="gift-type-input"
                  className="form-control input-md gift-type-input" 
                  defaultValue={this.props.isNew ? 'Official' : this.props.data.type}>
                  <option>Official</option>
                  <option>Personal</option>
                  <option>Unknown</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gift-motif-checklist" className="control-label exchange-form-label">Motif(s):</label>
          <div id="gift-motif-selector" name="gift-motif-checklist">
            {
              MotifSelector({
                itemClassName: 'motif-list-item',
                selectedMotifs: this.props.data.motifs
              })
            }
          </div>
        </div>
      </div>
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
  getSelectedMotifList: function() {
    var $dom = $(this.getDOMNode());
    var $items = $('#gift-motif-selector .motif-list-item.active', $dom);
    var selectedIds = [];
    $items.each(function() {
      selectedIds.push($(this).data('motifid'));
    });
    return selectedIds.join(',');
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
    serialized.motifs = this.getSelectedMotifList();
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
      <div className={this.state.className}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-hidden="true" data-dismiss="modal" onClick={closeDelegate}>x</button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {
                HostBody({
                  data: this.props.data,
                  isNew: this.props.isNew,
                  onComplete: this.handleHostEditComplete
                })
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={closeDelegate}>cancel</button>
              <button type="button" className="btn btn-info" onClick={saveDelegate}>save</button>
              <button type="button" className="btn btn-danger {(this.props.isNew ? 'hidden' : '')}" onClick={deleteDelegate}>delete</button>
            </div>
          </div>
        </div>
      </div>
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