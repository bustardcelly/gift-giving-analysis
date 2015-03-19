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
        <p>
          <img src={source} />
        </p>
        <p className={isLoading ? 'hidden' : ''}>
          <button type="btn" className="btn" onClick={this.removeImage}>remove</button>
        </p>
        <p className={!isLoading ? 'hidden progress-field' : 'progress-field'}>
          <strong>loading...</strong>
        </p>
      </div>
    );
  }

});

module.exports = ImageAttachmentItem;
