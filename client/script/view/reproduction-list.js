/** @jsx React.DOM */
'use strict';
var React = require('react');

var collFactory = require('../model/collection');
var reproductionService = require('../service/reproduction');
var reproductionDialog = require('./new-reproduction-dialog');
var EditableReproductionForm = require('./reproduction-form').EditableReproductionForm;

var ReproductionStore = require('../stores/ReproductionStore');

var ReproductionListItem = React.createClass({displayName: 'ReproductionListItem',
  onCancel: function() {
    this.setState({
      editing: false
    });
  },
  onSubmit: function(reproduction) {
    // reproductionService.updateReproduction(reproductionData)
    //   .then(function(update) {
    //     self.props.data._id = update._id;
    //     self.props.data._rev = update._rev;
    //     self.setState({
    //       editing: false
    //     });
    //   }, function(error) {
    //     // TODO: show error.
    //     console.log('Could not update Reproduction: ' + error);
    //   });
    this.props.onUpdate(reproduction);
  },
  onDelete: function(reproduction) {
    // reproductionService.deleteReproduction(reproductionData)
    //   .then(function() {
    //     self.setState({
    //       editing: false
    //     });
    //     if(self.props.onDelete) {
    //       self.props.onDelete(reproduction);
    //     }
    //   }, function(error) {
    //     // TODO: show error.
    //   });
    this.props.onDelete(reproduction);
  },
  getInitialState: function() {
    return {
      editing: false
    };
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
              onCancel: this.onCancel,
              onSubmit: this.onSubmit,
              onDelete: this.onDelete
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
  onDeleteReproduction: function(reproduction) {
    ReproductionStore.remove(reproduction);
  },
  onUpdateReproduction: function(reproduction) {
    ReproductionStore.update(reproduction);
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
          data: item,
          onDelete: deleteDelegate,
          onUpdate: updateDelegate
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
