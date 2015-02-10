/** @jsx React.DOM */
'use strict';
var React = require('react');

var ReproductionStore = require('../../stores/ReproductionStore');
var EditableReproductionForm = require('../../view/reproduction-form').EditableReproductionForm;

var ReproductionListItem = React.createClass({ displayName: 'ReproductionListItem',
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

module.exports = ReproductionListItem;
