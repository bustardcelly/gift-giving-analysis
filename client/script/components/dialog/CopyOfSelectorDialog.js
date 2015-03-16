/** @jsx React.DOM */
/** global $ */
'use strict';
var React = require('react');
var GiftStore = require('../../stores/GiftStore');
var ExchangeStore = require('../../stores/ExchangeStore');

var GiftList = React.createClass({

  _onGiftList: function(list) {
    this.setState({
      giftList: list
    });
  },

  getInitialState: function() {
    return {
      selectedGiftId: undefined,
      giftList: undefined
    };
  },

  componentDidMount: function() {
    GiftStore.init().then(this._onGiftList.bind(this));
    this.setState({
      selectedGiftId: this.props.selectedGiftId
    });
  },

  filterGiftsByExchangeId: function(exchangeId) {
    if(this.state.giftList !== undefined) {
      return this.state.giftList
              .filter(function(item) {
                return item.exchange_id === exchangeId;
              })
              .map(function(item) {
                return {name: '(' + item.amount + ') ' + item.description, id: item._id};
              });
    }
    return [];
  },

  handleItemClick: function(event) {
    event.preventDefault();
    var $dom = $(this.getDOMNode());
    var $elems = $('li', $dom);
    var $elem = $(event.target);
    var wasSelected = $elem.hasClass('selected');
    $elems.each(function() {
      $(this).removeClass('selected');
    });

    if(!wasSelected) {
      $elem.addClass('selected');
      this.setState({
        selectedGiftId: $elem.data('id')
      })
    }
    return false;
  },

  render: function() {
    var selectedGiftId = this.state.selectedGiftId;
    var exchangeId = this.props.exchangeId;
    var clickHandler = this.handleItemClick;
    var gifts = this.state.giftList === undefined
      ? undefined
      : this.filterGiftsByExchangeId(exchangeId).map(function(item) {
        var classList = (item.id === selectedGiftId) ? ['selected'] : [];
        classList.push('list-group-item');
        return <li href="#" className={classList.join(' ')} data-id={item.id}>{item.name}</li>;
      });
    return (
      <ul id='exchange-selector-list' className='list-group' onClick={clickHandler}>
        {
          gifts
        }
      </ul>
    );
  }


});

var HostBody = React.createClass({

  _onExchangeList: function(list) {
    this.setState({
      exchangeList: list
    });
  },

  getInitialState: function() {
    return {
      selectedIndex: -1,
      exchangeList: undefined
    }
  },

  componentDidMount: function() {
    ExchangeStore.init().then(this._onExchangeList.bind(this));
    this.setState({
      selectedIndex: this.props.selectedIndex
    });
  },

  handleOnExchangeSelectionChange: function() {
    var $dom = this.getDOMNode();
    var $selector = $('#exchangeSelector', $dom);
    this.setState({
      selectedIndex: ExchangeStore.indexOfTitle($selector.val())
    });
  },

  render: function() {
    var selectedGiftId = this.props.selectedGiftId;
    var exchangeList = this.state.exchangeList;
    var index = this.state.selectedIndex;
    var selectedExchange = exchangeList === undefined  || this.state.selectedIndex <= -1
      ? undefined
      : exchangeList[this.state.selectedIndex];
    var options = exchangeList === undefined
      ? undefined
      : exchangeList.map(function(item) {
        return <option data-id={item._id}>{item.title}</option>;
      });
    var giftList = selectedExchange === undefined
      ? undefined
      : <GiftList {... {
          exchangeId: selectedExchange._id,
          selectedGiftId: selectedGiftId
        }} />;
    return (
      <div>
        <strong>Select Exchange:</strong>
        <p>
          <select id="exchangeSelector" defaultValue={selectedExchange !== undefined ? selectedExchange.name: 'N/A'} onChange={this.handleOnExchangeSelectionChange}>
            {
              options
            }
          </select>
        </p>
        <div>
          <strong>Select Gift:</strong>
          {
            giftList
          }
        </div>
      </div>
    );
  }
});

var Dialog = React.createClass({

  getInitialState: function() {
    return {
      exchangeList: undefined,
      className: 'modal fade'
    };
  },

  componentDidMount: function() {
    var $dom = $(this.getDOMNode());
    $dom.modal({
      background:true, show:true
    });
    $dom.on('hidden', function() {
      $dom.off('hidden');
      $dom.remove();
    });
  },
  componentWillUnmount: function() {
    var $dom = $(this.getDOMNode());
    $dom.off('hidden');
  },

  getSelectedGiftId: function() {
    var $dom = $(this.getDOMNode());
    var $selectedGiftItem = $('#exchange-selector-list > li.selected', $dom);
    if($selectedGiftItem !== undefined) {
      return $selectedGiftItem.data('id');
    }
    return undefined;
  },

  show: function() {
    this.setState({
      className: 'modal fade show'
    });
    setTimeout(function() {
      this.setState({
        className: 'modal fade show in'
      });
    }.bind(this), 0);
  },

  hide: function(e) {
    if(e) {
      e.stopPropagation();
    }
    this.setState({
      className: 'modal fade'
    });
    $(this.getDOMNode()).modal('hide');
  },

  save: function(e) {
    if(e) {
      e.stopPropagation();
    }
    if(this.props.onSave) {
      this.props.onSave(this.getSelectedGiftId());
    }
    this.hide();
  },

  delete: function(e) {
     if(e) {
      e.stopPropagation();
    }
    if(this.props.onDelete) {
      this.props.onDelete(this.props.data);
    }
    this.hide();
  },

  render: function() {
    var closeDelegate = this.hide;
    var saveDelegate = this.save;
    return (
      <div className={this.state.className}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" aria-hidden="true" data-dismiss="modal" onClick={closeDelegate}>x</button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {
                HostBody({
                  selectedIndex: 0,
                  selectedGiftId: this.props.selectedGiftId
                })
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={closeDelegate}>cancel</button>
              <button type="button" className="btn btn-info" onClick={saveDelegate}>save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  render: function(selectedGiftId, saveResponder) {
    var title = 'Change Copy-Of Gift Reference';
    React.renderComponent(
      <Dialog {... {
        title: title,
        selectedGiftId: selectedGiftId,
        onSave: saveResponder
      }} />,
      window.document.getElementById('copyof-gift-dialog')
    );
  }
};
