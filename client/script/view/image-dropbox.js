/** @jsx React.DOM */
'use strict';
var React = require('react');
var imgAttachmentFactory = require('../model/image-attachment-item');

var statesEnum = imgAttachmentFactory.states;

var ImageAttachmentItem = React.createClass({displayName: 'ImageAttachmentItem',
  _imageBoxItemUpdate: function() {
    if (this.isMounted()) {
      this.forceUpdate();
    }
  },
  componentDidMount: function() {
    var attachment = this.props.data;
    this._boundForceUpdate = this._imageBoxItemUpdate.bind(this, null);
    attachment.on('change', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    var attachment = this.props.data;
    attachment.removeListener('change', this._boundForceUpdate);
  },
  onRemove: function() {
    this.props.removeHandler(this.props.data);
  },
  render: function() {
    var source = this.props.data.url || this.props.data.source;
    var state = this.props.data.state;
    return (
      <li>
        <p>
          <img src={source} />
        </p>
        <p className={state !== statesEnum.LOADED ? 'hidden' : ''}>
          <button type="btn" className="btn" onClick={this.onRemove}>remove</button>
        </p>
        <p className={state !== statesEnum.LOADING ? 'hidden progress-field' : 'progress-field'}>
          <strong>Loading...</strong>
        </p>
      </li>
    );
  }
});

module.exports = React.createClass({displayName: 'ImageDropBox',
  _imageBoxUpdate: function() {
    if (this.isMounted()) {
      this.forceUpdate();
    }
  },
  getAttachmentCollection: function() {
    return this.props.data._attachmentList;
  },
  componentDidMount: function() {
    var model = this.props.data;
    var attachments = model._attachments;
    var attachmentService = this.props.service;
    var attachmentList = this.getAttachmentCollection();

    this._boundForceUpdate = this._imageBoxUpdate.bind(this, null);
    attachmentList.on('change', this._boundForceUpdate, this);

    if(attachments) {
      Object.keys(attachments).map(function(filename) {
        attachmentService.getImageAttachmentURL(model, filename)
          .then(function(data) {
            var img = imgAttachmentFactory.create(data);
            img.updateState(statesEnum.LOADED);
            attachmentList.add(img);
          });
        });
    }
  },
  componentWillUnmount: function() {
    this.getAttachmentCollection().removeListener('change', this._boundForceUpdate)
  },
  previewDroppedFile: function(file) {
    var dfd = $.Deferred();
    var reader;
    var onFileLoad = function(file, $list) {
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
    return dfd;
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
    var d = this.props.data;
    var file = event.dataTransfer.files ? event.dataTransfer.files[0] : undefined;
    var attachmentList = this.getAttachmentCollection();
    var attachmentService = this.props.service;
    if(file !== undefined) {
      data = new FormData();
      data.append('file_1', file);
      this.previewDroppedFile(file)
        .then(function(source) {

          var img = imgAttachmentFactory.create({
            source: source,
            filename: file.name
          });

          attachmentList.add(img);
          
          attachmentService.addAttachments(d, data)
            .then(function(data) {
              img.updateState(statesEnum.LOADED);
            }, function(error) {
              // TODO: Remove from list.
              // TODO:  Show error.
              img.updateState(statesEnum.ERROR);
            });

        }, function(error) {
          // TODO: Show error.
        });
    }
    return false;
  },
  handleRemoveAttachment: function(attachmentData) {
    var model = this.props.data;
    var filename = attachmentData.filename;
    var attachmentService = this.props.service;
    var attachmentList = this.getAttachmentCollection();
    attachmentService.removeAttachment(model, filename)
      .then(function() {
        attachmentList.remove(attachmentData);
      });
  },
  render: function() {
    var rows = [];
    var removeDelegate = this.handleRemoveAttachment;
    var attachments = this.getAttachmentCollection();
    attachments.get().map(function(data) {
      rows.push(<ImageAttachmentItem {... {
        data: data,
        removeHandler: removeDelegate
      }} />);
    });
    return (
      <div className="form-group">
        <label htmlFor="image-attachment-container" className="control-label form-label">Images:</label>
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
