/** @jsx React.DOM */
'use strict';
var React = require('react');
var MotifStore = require('../../stores/MotifStore');

module.exports = React.createClass({displayName: 'MotifSelector',

  _onAll: function(list) {
    this.setState({
      motifList: list
    });
  },

  getInitialState: function() {
    return {
      motifList: undefined,
      selectedMotifs: undefined
    };
  },

  componentDidMount: function() {
    this.setState({
      selectedMotifs: this.props.value
    });
    MotifStore.all().then(this._onAll.bind(this));
  },

  updateSelectedMotifs: function() {
    this.setState({
      selectedMotifs: this.value()
    });
  },

  revert: function(value) {
    this.setState({
      selectedMotifs: value
    });
  },

  value: function() {
    var $dom = this.getDOMNode();
    var $items = $('.motif-list-item.active', $dom);
    var selectedIds = [];
    $items.each(function() {
      selectedIds.push($(this).data('motifid'));
    });
    return selectedIds.join(',');
  },

  render: function() {
    var items = undefined;
    var motifs = this.state.selectedMotifs;
    var clickDelegate = this.updateSelectedMotifs;
    var selections = (motifs === null || typeof motifs === 'undefined') ? [] : motifs.split(',');
    if(this.state.motifList !== undefined) {
      items = this.state.motifList.map(function(item) {
        var classList = ['btn', 'motif-list-item'];
        if(selections.indexOf(item.id) > -1) {
          classList.push('active');
        }
        return (
          <button type="button" className={classList.join(' ')} data-motifid={item.id} onClick={clickDelegate}>
            {item.value}
          </button>
        );
      });
    }
    return (
      <div class="btn-group" data-toggle="buttons-checkbox">
        {items}
      </div>
    );
  }
});
