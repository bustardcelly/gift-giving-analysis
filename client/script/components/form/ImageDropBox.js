/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({displayName: 'ImageDropBox',

  _onAll: function() {
    this.setState({
      attachments: this.store.all(this.props.data._id)
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
    return (
      <h1>hello</h1>
    );
  }

});
