'use strict';

var assign = require('object-assign');
var Dispatcher = require('flux-react-dispatcher');

module.exports = assign(new Dispatcher(), {

  handleAsyncAction: function(action) {
    this.dispatch({
      source: 'ASYNC_ACTION',
      action: action
    });
  }

});
