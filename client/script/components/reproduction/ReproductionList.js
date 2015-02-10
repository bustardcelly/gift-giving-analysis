/** @jsx React.DOM */
'use strict';
var React = require('react');

var reproductionDialog = require('../../view/new-reproduction-dialog');
var ReproductionStore = require('../../stores/ReproductionStore');
var ReproductionListItem = require('./ReproductionListItem');

var ReproductionList = React.createClass({displayName: 'ReproductionList',
  _onChange: function() {
    this.setState({
      reproductions: ReproductionStore.all()
    });
  },
  getInitialState: function() {
    return {
      reproductions: ReproductionStore.all()
    };
  },
  handleReproductionAdd: function() {
    reproductionDialog.render(this.handleSubmitNewReproduction);
  },
  handleSubmitNewReproduction: function(reproduction) {
    ReproductionStore.add(reproduction);
  },
  componentDidMount: function() {
    ReproductionStore.addChangeListener(this._onChange);
    ReproductionStore.init();
  },
  componentWillUnmount: function() {
    ReproductionStore.removeChangeListener(this._onChange);
  },
  render: function() {
    var deleteDelegate = this.onDeleteReproduction;
    var updateDelegate = this.onUpdateReproduction;
    var rows = this.state.reproductions.map(function(item) {
        return <ReproductionListItem {... {
          data: item
        }} />
    });
    return (
      <div>
        <h2 id="reproduction-title" class="add-reproduction-title">Reproductions:
          <img className="svg-icon-btn add-reproduction-button svg-icon-right"
                type="image/svg+xml"
                width="24" height="24"
                src="img/add-plus.svg"
                onClick={this.handleReproductionAdd} />
        </h2>
        <ul className="reproduction-list">{rows}</ul>
      </div>
    );
  }
});

module.exports = {
  ReproductionList: ReproductionList,
  render: function(element) {
    React.renderComponent(
      ReproductionList({}),
      element
    );
  }
};
