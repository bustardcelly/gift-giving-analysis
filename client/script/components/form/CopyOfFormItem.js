/** @jsx React.DOM */
var React = require('react');
var GiftStore = require('../../stores/GiftStore');
var ExchangeStore = require('../../stores/ExchangeStore');
var CopyOfDialog = require('../dialog/CopyOfSelectorDialog');

module.exports = React.createClass({ displayName: 'CopyOfFormItem',

  _onGiftAll: function() {
    this.setState({
      gift: GiftStore.withId(this.props.giftId)
    });
  },

  _onExchangeAll: function() {
    if (this.isMounted()) {
      this.forceUpdate();
    }
  },

  getInitialState: function() {
    return {
      giftId: undefined,
      gift: undefined
    };
  },

  componentDidMount: function() {
    GiftStore.init().then(this._onGiftAll.bind(this));
    ExchangeStore.init().then(this._onExchangeAll.bind(this));
    this.setState({
      giftId: this.props.giftId,
      gift: GiftStore.withId(this.props.giftId)
    });
  },

  componentWillUnmount: function() {},

  onSaveCopyOfGift: function(selectedGiftId) {
    this.setState({
      giftId: selectedGiftId
    });
  },

  handleChangeCopyOf: function(event) {
    event.preventDefault();
    CopyOfDialog.render(this.state.giftId, this.onSaveCopyOfGift);
    return false;
  },

  getExchangeGiftTitle: function(giftId) {
    var gift = this.state.gift;
    var exchange = gift !== undefined ? ExchangeStore.withId(gift.exchange_id) : undefined;
    if(gift !== undefined && exchange !== undefined) {
      return [exchange.title, gift.description].join(': ');
    }
  },

  revert: function(originalValue) {
    this.setState({
      giftId: originalValue,
      gift: GiftStore.withId(originalValue)
    });
  },
  value: function() {
    return this.state.giftId;
  },
  render: function() {
    var giftName = this.getExchangeGiftTitle(this.state.giftId);
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
