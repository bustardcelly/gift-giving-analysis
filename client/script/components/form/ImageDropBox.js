/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({displayName: 'ImageDropBox',

  getInitialState: function() {
    return {
      attachments: undefined
    };
  },

  _onAll: function() {
    this.setState({
      attachments: this.props.store.all(this.props.data._id)
    });
  },

  _onAdd: function() {
  },

  _onRemove: function() {
  },

  componentDidMount: function() {
    var model = this.props.data;
    var store = this.props.store;
    var attachments = model._attachments;

    store.addGetListener(this._onAll);
    store.addAddListener(this._onAdd);
    // action.addRemoveListener(this._onRemove);
    if(model.hasOwnProperty('_attachments')) {
      store.get(model._id, Object.keys(attachments));
    }
  },

  componentWillUnmount: function() {
    this.props.store.removeAllListener(this._onAll);
    this.props.store.removeAddListener(this._onAdd);
    // this.props.action.removeRemoveListener(this._onRemove);
  },

  render: function() {
    var rows = [];
    var attachments = this.state.attachments;
    if(attachments !== undefined) {
      attachments.forEach(function(data) {
        rows.push(<img src={data.url} />);
      });
    }
    return (
      <div className="form-group">
        <label htmlFor="image-attachment-container" className="control-label image-form-label">Images:</label>
        <div name="image-attachment-container">
          <ul className="image-attachment-list">
            {rows}
          </ul>
          <div className="image-dropbox">
            <span>Drop image file here</span>
          </div>
        </div>
      </div>
    );
  }


});
