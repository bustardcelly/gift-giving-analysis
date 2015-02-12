/** @jsx React.DOM */
/** global $*/
'use strict';

var React = require('react');

module.exports = React.createClass({displayName: 'TextAreaFormItem',
  revert: function() {
    var $dom = this.getDOMNode();
    var $input = $('textarea', $dom);
    $input.val(this.props.value);
  },
  value: function() {
    var $dom = this.getDOMNode();
    var $input = $('textarea', $dom);
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
        <textarea type="text" name={name} className={iClasses} placeholder={this.props.placeholder} defaultValue={this.props.value}></textarea>
      </div>
    );
  }
});
