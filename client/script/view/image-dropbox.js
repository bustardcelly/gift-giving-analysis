/** @jsx React.DOM */
'use strict';
var React = require('react');
var reproductionService = require('../service/reproduction');

module.exports = React.createClass({displayName: 'ImageDropBox',
  componentDidMount: function() {
    var $dom = $(this.getDOMNode());
    var $list = $('.image-attachment-list', $dom);
    var reproduction = this.props.data;
    var attachments = this.props.data._attachments;
    if(attachments) {
      Object.keys(attachments).map(function(filename) {
        reproductionService.getImageAttachmentURL(reproduction, filename)
          .then(function(url) {
            $list.append('<li><img src="' + url + '" /></li>');
          });
        });
    }
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
        })
    }
    return false;
  },
  render: function() {
    var reproduction = this.props.data;
    return (
      <div className="form-group">
        <label htmlFor="reproduction-image-container" className="control-label reproduction-form-label">Images:</label>
        <ul className="image-attachment-list"></ul>
        <div className="image-dropbox" 
              onDragOver={this.noop} onDragExit={this.noop} 
              onDragEnter={this.handleDragEnter} onDrop={this.handleDrop}>
          <span>Drop image file here</span>
        </div>
      </div>
    );
  }
});
