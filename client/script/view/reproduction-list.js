/** @jsx React.DOM */
'use strict';
var React = require('react');

var collFactory = require('../model/collection');
var reproductionService = require('../service/reproduction');
var reproductionDialog = require('./new-reproduction-dialog');
var EditableReproductionForm = require('./reproduction-form').EditableReproductionForm;

var ReproductionListItem = React.createClass({displayName: 'ReproductionListItem',
  onCancel: function() {
    this.setState({
      editing: false
    });
  },
  onSubmit: function(reproductionData) {
    var self = this;
    reproductionService.updateReproduction(reproductionData)
      .then(function(update) {
        self.props.data._id = update._id;
        self.props.data._rev = update._rev;
        self.setState({
          editing: false
        });
      }, function(error) {
        // TODO: show error.
        console.log('Could not update Reproduction: ' + error);
      });
  },
  onDelete: function(exchangeData) {
    var self = this;
    console.log('delete');
    // exchangeService.deleteExchange(exchangeData)
    //   .then(function() {
    //     if(self.props.onDelete) {
    //       self.props.onDelete(exchangeData);
    //     }
    //     self.setState({
    //       editing: false
    //     });
    //   }, function(error) {
    //     // TODO: show error.
    //     exchangeData.gifts = giftCollection;
    //   });
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
  handleReproductionAdd: function() {
    reproductionDialog.render(this.handleSubmitNewReproduction);
  },
  handleSubmitNewReproduction: function(reproductionData) {
    console.log('Submit new reproduction: ' + JSON.stringify(reproductionData, null, 2));
    var list = this.props.list;
    reproductionService.addReproduction(reproductionData)
      .then(function(data) {
        data._attachmentList = collFactory.create();
        list.add(data);
      }, function(error) {
        // TODO: Show error.
      });
  },
  onDeleteReproduction: function(exchange) {
    this.props.list.remove(exchange);
  },
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.list.on('change', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.props.list.removeListener('change', this._boundForceUpdate);
  },
  render: function() {
    var deleteDelegate = this.onDeleteReproduction;
    var rows = [];
    Array.prototype.forEach.call(this.props.list.get(), function(item) {
      rows.push(
        ReproductionListItem({
          data: item,
          onDelete: deleteDelegate
        })
      );
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
  render: function(element, list) {
    React.renderComponent(
      ReproductionList({
        list: list
      }),
      element
    );
  }
};
