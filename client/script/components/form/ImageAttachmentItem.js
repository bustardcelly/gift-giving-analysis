/** @jsx React.DOM*/
'use strict';
var React = require('react');

var ImageAttachmentItem = React.createClass({displayName: 'ImageAttachmentItem',

  removeImage: function() {
    this.props.store.remove(this.props.reproduction, this.props.data.filename);
  },

  render: function() {
    var isLoading = this.props.data.hasOwnProperty('loading');
    var source = !isLoading ? this.props.data.url : this.props.data.src;
    var loadingClass = !isLoading ? 'hidden' : '';
    var removalClass = !isLoading ? '' : 'hidden';
    return (
      <div>
        <img src={source} />
        <p>
          <span className={loadingClass}>Loading...</span>
          <button className={removalClass} onClick={this.removeImage}>Remove</button>
        </p>
      </div>
    );
  }

});

module.exports = ImageAttachmentItem;

