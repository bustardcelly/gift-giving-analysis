/** @jsx React.DOM */
'use strict';
var React = require('react');

var collFactory = require('../model/collection');
var reproductionService = require('../service/reproduction');
var reproductionDialog = require('./new-reproduction-dialog');
var EditableReproductionForm = require('./reproduction-form').EditableReproductionForm;

var ReproductionStore = require('../stores/ReproductionStore');

var ReproductionListItem = React.createClass({displayName: 'ReproductionListItem',
  _onCancel: function() {
    this.setState({
      editing: false
    });
  },
  _onUpdate: function() {
    this.setState({
      editing: false
    });
  },
  _onSubmit: function(reproduction) {
    ReproductionStore.update(reproduction);
  },
  _onDelete: function(reproduction) {
    ReproductionStore.remove(reproduction);
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  componentDidMount: function() {
    ReproductionStore.addUpdateListener(this._onUpdate);
    ReproductionStore.addRemoveListener(this._onUpdate);
  },
  componentWillUnmount: function() {
    ReproductionStore.removeUpdateListener(this._onUpdate);
    ReproductionStore.removeRemoveListener(this._onUpdate);
  },
  handleSelect: function(event) {
    event.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
    return false;
  },
  render: function() {
    return (
      <li class="reproduction-list-item">
        <p>
          <img className="svg-icon-btn svg-icon-left"
                type="image/svg+xml"
                width="24" height="24"
                src={this.state.editing ? 'img/close.svg' : 'img/open.svg'}
                onClick={this.handleSelect} />
          <a href="#" onClick={this.handleSelect}>{this.props.data.title}</a>
        </p>
        <div className={(this.state.editing ? 'reproduction-form' : 'reproduction-form hidden')}>
          <EditableReproductionForm {... {
              data: this.props.data,
              onCancel: this._onCancel,
              onSubmit: this._onSubmit,
              onDelete: this._onDelete
            }} />
        </div>
      </li>
    );
  }
});

var ReproductionList = React.createClass({displayName: 'ReproductionList',
  _onChange: function() {
    this.setState({
      reproductions: ReproductionStore.all()
    });
  },
  getInitialState: function() {
    return {
      reproductions: ReproductionStore.all()
    }
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
