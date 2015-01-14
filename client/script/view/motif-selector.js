/** @jsx React.DOM */
'use strict';
var React = require('react');
var motifStore = require('../store/motif-store');

var MotifSelectorItem = React.createClass({displayName: 'MotifSelectorItem', 
  render: function() {
    var classList = ["btn", this.props.itemClassName];
    if(this.props.selected) {
      classList.push("active");
    }
    return (
      <button type="button" className={classList.join(" ")} data-motifid={this.props.data.id}>{this.props.data.value}</button>
    );
  }
});

module.exports = React.createClass({displayName: 'MotifSelector',
  render: function() {
    var items = [];
    var itemClassName = this.props.itemClassName;
    var motifs = this.props.selectedMotifs;
    var selections = (motifs === null || typeof motifs === 'undefined') ? [] : motifs.split(',');
    Array.prototype.forEach.call(motifStore.all(), function(item) {
      items.push(
        MotifSelectorItem({
          data: item,
          itemClassName: itemClassName,
          selected: selections.indexOf(item.id) > -1
        })
      );
    });
    return (
      <div class="btn-group" data-toggle="buttons-checkbox">
        {items}
      </div>
    );
  }
});
  