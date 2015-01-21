/** @jsx React.DOM */
'use strict';
var React = require('react');

var ReproductionForm = React.createClass({displayName: 'ReproductionForm', 
  render: function() {
    return (
      <h1>hello, form</h1>
    );
  }
});

module.exports = {
  ReproductionForm: ReproductionForm,
  render: function(element, data) {
    React.renderComponent(
      ReproductionForm({
        data: data
      }),
      element
    );
  }
};
