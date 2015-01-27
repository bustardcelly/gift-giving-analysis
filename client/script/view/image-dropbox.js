/** @jsx React.DOM */
'use strict';
var React = require('react');
var reproductionService = require('../service/reproduction');

var ImageAttachmentItem = React.createClass({displayName: 'ImageAttachmentItem',
  onRemove: function() {
    this.props.removeHandler(this.props.data.filename);
  },
  render: function() {
    return (
      <li>
          <img src={this.props.data.url} />
        <p>
          <button type="btn" className="btn" onClick={this.onRemove}>remove</button>
        </p>
      </li>
    );
  }
});

module.exports = React.createClass({displayName: 'ImageDropBox',
  componentDidMount: function() {
    var reproduction = this.props.data;
    var attachments = reproduction._attachments;
    var attachmentList = this.props.data._attachmentList;

    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    attachmentList.on('change', this._boundForceUpdate, this);

    if(attachments) {
      Object.keys(attachments).map(function(filename) {
        reproductionService.getImageAttachmentURL(reproduction, filename)
          .then(function(data) {
            attachmentList.add(data);
          });
        });
    }
  },
  componentDidUnmount: function() {
    this.props.data._attachmentList.off('change', this._boundForceUpdate)
  },
  previewDroppedFile: function(file) {
    var $dom = $(this.getDOMNode());
    var $list = $('.image-attachment-list', $dom);
    var reader;
    var onFileLoad = function(file, $list) {
      return function(event) {
        $list.append('<li><img src="' + event.target.result + '" /></li>');
      };
    };
    if(!file.type.match('image.*')) {
      return false;
    }
    else {
      reader = new FileReader();
      reader.onload = onFileLoad(file, $list);
      reader.readAsDataURL(file);
    }
    return true;
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
    var d = this.props.data;
    var file = event.dataTransfer.files ? event.dataTransfer.files[0] : undefined;
    var data;
    if(file !== undefined) {
      data = new FormData();
      data.append('file_1', file);
      this.previewDroppedFile(file);
      reproductionService.addAttachments(this.props.data, data)
        .then(function(reproductionData) {
          console.log(d._rev + ', ' + reproductionData._rev);
        }, function(error) {
          // TODO: Remove from list.
          // TODO:  Show error.
        });
    }
    return false;
  },
  handleRemoveAttachment: function(filename) {
    var reproduction = this.props.data;
    reproductionService.removeAttachment(reproduction, filename)
      .then(function() {
        // TODO: remove from collection.
      });
  },
  render: function() {
    var rows = [];
    var reproduction = this.props.data;
    var removeDelegate = this.handleRemoveAttachment;
    var attachments = reproduction._attachmentList.get();
    var attachmentListing = attachments.map(function(data) {
      rows.push(<ImageAttachmentItem {... {
        data: data,
        removeHandler: removeDelegate
      }} />);
    });
    return (
      <div className="form-group">
        <label htmlFor="reproduction-image-container" className="control-label reproduction-form-label">Images:</label>
        <ul className="image-attachment-list">
          {rows}
        </ul>
        <div className="image-dropbox" 
              onDragOver={this.noop} onDragExit={this.noop} 
              onDragEnter={this.handleDragEnter} onDrop={this.handleDrop}>
          <span>Drop image file here</span>
        </div>
      </div>
    );
  }
});
