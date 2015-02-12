/** @jsx React.DOM */
/** global $*/
'use strict';
var React = require('react');
var MotifSelector = require('./MotifSelector');

var render = 0;

module.exports = React.createClass({displayName: 'MotifFormItem',
  revert: function(value) {
    this.refs.motifSelector.revert(this.props.value);
  },
  value: function() {
    return this.refs.motifSelector.value();
  },
  render: function() {
    var name = this.props.name;
    var labelClasses = ['control-label'];
    var lClasses = labelClasses.concat(this.props.labelClasses).join(' ');
    return (
      <div className="form-group">
        <label htmlFor={name} className={lClasses}>{this.props.label}:</label>
        <div name={name}>
          <MotifSelector ref="motifSelector" {... {
            itemClassName: 'motif-list-item',
            value: this.props.value
          }} />
        </div>
      </div>
    );
  }
});
