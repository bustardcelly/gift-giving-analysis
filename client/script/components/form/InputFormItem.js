/** @jsx React.DOM */
/** global $*/
'use strict';

var React = require('react');

module.exports = React.createClass({displayName: 'FormInputItem',
  value: function() {
    var $dom = this.getDOMNode();
    var $input = $('input', $dom);
    return $input.val();
  },
  render: function() {
    var name = this.props.name;
    var inputClasses = ['form-control', 'input-md'];
    var labelClasses = ['control-label'];
    var iClasses = inputClasses.concat(this.props.inputClasses).join(' ');
    var lClasses = labelClasses.concat(this.props.labelClasses).join(' ');
    return (
      <div className="form-group">
        <label htmlFor={name} className={lClasses}>{this.props.label}:</label>
        <input type="text" name={name} className={iClasses} placeholder={this.props.placeholder} defaultValue={this.props.value}></input>
      </div>
    );
  }
});
