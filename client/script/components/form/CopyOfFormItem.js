/** @jsx React.DOM */
'use strict';
var React = require('react');
var giftStore = require('../../store/gift-store');
var exchangeStore = require('../../store/exchange-store');
var copyOfGiftDialog = require('../../view/copyof-selector-dialog');

var getGiftNameFromId = function(id) {
  var gift = giftStore.withId(id);
  var exchange;
  if(gift !== undefined) {
    exchange = exchangeStore.withId(gift.exchange_id);
    return [exchange.title, gift.description].join(': ');
  }
  return 'Unknown';
};

module.exports = React.createClass({ displayName: 'CopyOfFormItem',
  getInitialState: function() {
    return {
      giftId: undefined
    };
  },
  componentDidMount: function() {
    this.setState({
      giftId: this.props.giftId
    });
  },
  onSaveCopyOfGift: function(selectedGiftId) {
    this.setState({
      giftId: selectedGiftId
    })
  },
  handleChangeCopyOf: function(event) {
    event.preventDefault();
    copyOfGiftDialog.render(this.state.giftId, this.onSaveCopyOfGift);
    return false;
  },
  value: function() {
    return this.state.giftId;
  },
  render: function() {
    var giftName = getGiftNameFromId(this.state.giftId);
    return (
      <div className="form-group">
        <label htmlFor="reproduction-copy-of-input" className="control-label reproduction-form-label">Copy Of:</label>
        <div name="reproduction-copy-of-input" className="form-control reproduction-copy-of-container" data-copyofid={this.state.giftId}>
          <p className="copy-of-title">{giftName}</p>
          <button type="button" className="btn" onClick={this.handleChangeCopyOf}>Change</button>
        </div>
      </div>
    );
  }
});
