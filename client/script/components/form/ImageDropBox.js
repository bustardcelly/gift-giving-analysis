/** @jsx React.DOM */
'use strict';
var Q = require('q');
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
    this.setState({
      attachments: this.props.store.all(this.props.data._id)
    });
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

  previewDroppedFile: function(file) {
    var reader;
    var dfd = Q.defer();
    var onFileLoad = function(file) {
      return function(event) {
        dfd.resolve(event.target.result);
      };
    };
    if(!file.type.match('image.*')) {
      return dfd.reject("Can only drop image files.");
    }
    else {
      reader = new FileReader();
      reader.onload = onFileLoad(file);
      reader.onerror = function(err) {
        dfd.reject(err);
      };
      reader.readAsDataURL(file);
    }
    return dfd.promise;
  },

  noop: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    return false;
  },

  handleDrop: function(event) {
    event.stopPropagation();
    event.preventDefault();
    var data;
    var store = this.props.store;
    var reproduction = this.props.data;
    var file = event.dataTransfer.files ? event.dataTransfer.files[0] : undefined;
    if(file !== undefined) {
      data = new FormData();
      data.append('file_1', file);
      this.previewDroppedFile(file)
          .then(function(source) {
            store.add(reproduction, file.name, source, data);
          }, function(error) {
            // TODO: Show error.
          });
    }
    return false;
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
          <div className="image-dropbox"
                onDragOver={this.noop} onDragExit={this.noop}
                onDragEnter={this.handleDragEnter} onDrop={this.handleDrop}>
            <span>Drop image file here</span>
          </div>
        </div>
      </div>
    );
  }


});
