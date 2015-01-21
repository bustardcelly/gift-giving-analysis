/** @jsx React.DOM */
'use strict';
var React = require('react');

var ReproductionListItem = React.createClass({displayName: 'ReproductionListItem',
  render: function() {
    return (
      <h1>hello, world.</h1>
    );
  }
});

var ReproductionList = React.createClass({displayName: 'ReproductionList',
  handleReproductionAdd: function() {
    // exchangeDialog.render(this.handleSubmitNewExchange);
  },
  // handleSubmitNewExchange: function(exchangeData) {
  //   console.log('Submit new exchange: ' + JSON.stringify(exchangeData, null, 2));
  //   var list = this.props.list;
  //   exchangeService.addExchange(exchangeData)
  //     .then(function(data) {
  //       data.gifts = collFactory.create();
  //       list.add(data);
  //     }, function(error) {
  //       // TODO: Show error.
  //     });
  // },
  onDeleteExchange: function(exchange) {
    this.props.list.remove(exchange);
  },
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.list.on('change', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.props.list.off('change', this._boundForceUpdate);
  },
  render: function() {
    var deleteDelegate = this.onDeleteExchange;
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
