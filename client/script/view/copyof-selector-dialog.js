/** @jsx React.DOM */
/*global window, $*/
'use strict';
var React = require('react');

var exchangeStore = require('../store/exchange-store');
var giftStore = require('../store/gift-store');

var exchangeList;
var inflatExchangeList = function() {
  if(exchangeList === undefined) {
    exchangeList = exchangeStore.all().map(function(item) {
      return {id: item._id, name: item.title};
    });
  }
};
var giftsByExchangeId = function(id) {
  return giftStore.all().filter(function(item) {
            return item.exchange_id === id;
          }).map(function(item) {
            return {name: '(' + item.amount + ') ' + item.description, id: item._id};
          });
};
var indexOfExchangeTitle = function(title) {
  var i = exchangeList.length;
  while(--i > -1) {
    if(exchangeList[i].name === title) {
      return i;
    }
  }
  return i;
};

var GiftList = React.createClass({
  getInitialState: function() {
    return {
      selectedGiftId: undefined
    };
  },
  componentWillMount: function() {
    this.setState({
      selectedGiftId: this.props.selectedGiftId
    });
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
    else {
      this.setState({
        selectedGiftId: undefined
      })
    }

    return false;
  },
  render: function() {
    var selectedGiftId = this.state.selectedGiftId;
    var exchangeId = this.props.exchangeId;
    var clickHandler = this.handleItemClick;
    return (
      <ul id='exchange-selector-list' className='list-group'>
        {
          giftsByExchangeId(exchangeId)
            .map(function(item) {
              var classList = (item.id === selectedGiftId) ? ['selected'] : [];
              classList.push('list-group-item');
              return <li href='#' className={classList.join(' ')} data-id={item.id} onClick={clickHandler}>{item.name}</li>
            })
        }
      </ul>
    );
  }
});

var HostBody = React.createClass({
  getInitialState: function() {
    return {
      selectedIndex: 0
    };
  },
  handleOnExchangeSelectionChange: function() {
    var $dom = $(this.getDOMNode());
    var $selector = $('#exchange-selector', $dom);
    this.setState({
      selectedIndex: indexOfExchangeTitle($selector.val())
    });
  },
  render: function() {
    return (
      <div>
        <strong>Select Exchange:</strong>
        <p>
          <select id="exchange-selector" defaultValue={exchangeList[this.state.selectedIndex].name} onChange={this.handleOnExchangeSelectionChange}>
            {
              exchangeList.map(function(item) {
                return <option data-id={item.id}>{item.name}</option>
              })
            }
          </select>
        </p>
        <div>
          <strong>Select Gift:</strong>
          {
            GiftList({
              exchangeId: exchangeList[this.state.selectedIndex].id,
              selectedGiftId: this.props.selectedGiftId
            })
          }
        </div>
      </div>
    );
  }
});

var Dialog = React.createClass({
  getInitialState: function() {
    return {
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
    inflatExchangeList();
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
    var dialog = Dialog({
      title: title,
      selectedGiftId: selectedGiftId,
      onSave: saveResponder
    });
    React.renderComponent(
      dialog,
      window.document.getElementById('copyof-gift-dialog')
    );
  }
};
