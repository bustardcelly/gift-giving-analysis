/** @jsx React.DOM */
'use strict';
var React = require('react');
var reproductionService = require('../service/reproduction');

module.exports = React.createClass({displayName: 'ImageDropBox',
  previewDroppedFile: function(file) {
    var $dom = $(this.getDOMNode());
    var $list = $('.image-preview-list', $dom);
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
    var file = event.dataTransfer.files ? event.dataTransfer.files[0] : undefined;
    var data;
    if(file !== undefined) {
      data = new FormData();
      data.append('file_1', file);
      this.previewDroppedFile(file);
      reproductionService.addAttachments(this.props.data, data);
    }
    return false;
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="reproduction-image-container" className="control-label reproduction-form-label">Images:</label>
        <ul className="image-preview-list"></ul>
        <div className="image-dropbox" 
              onDragOver={this.noop} onDragExit={this.noop} 
              onDragEnter={this.handleDragEnter} onDrop={this.handleDrop}>
          <span>Drop image file here</span>
        </div>
      </div>
    );
  }
});
