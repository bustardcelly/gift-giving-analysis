/** @jsx React.DOM */
'use strict';
var React = require('react');
var Reflux = require('reflux');
var reproductionService = require('../service/reproduction');

var loadDelegate = function(url) {
  var complete = this.completed;
  var fail = this.failed;
  reproductionService
    .addAttachments(this.props.data, data)
    .then(copmlete, fail);
};

var Actions = Reflux.createActions({
    "load": {children: ["completed","failed"]}
});

var ImageAttachment = React.createClass({

  getInitialState: function() {
    return {
      isLoading: true
    };
  },

  removeImage: function() {
    // ReproductionImageStore.removeImage(this.props.url);
  },

  completed: function() {
    this.setState({
      isLoader: false
    });
  },

  failed: function() {
    // TODO: show error.
  },

  load: function(url) {

    var self = this;
    var action = Reflux.createActions({
        "load": {children: ["completed","failed"]}
    });

    action.load.completed.listen(function(d) {
      self.completed();
    });

    action.load.failed.listen(function(error) {
      self.failed();
    });

    action.load(url);

  },

  render: function() {

    var loadingClass = this.state.isLoading ? '' : 'hidden';
    var removalClass = this.state.isLoading ? 'hidden' : '';

    return (

      <div>
        <img src={this.props.source} />
        <p>
          <span className={loadingClass}>Loading...</span>
          <button className={removalClass} onClick={removeImage}>Remove</button>
        </p>
      </div>

    );
  }
});

module.exports = ImageAttachment;
