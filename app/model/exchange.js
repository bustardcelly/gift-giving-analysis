'use strict';
module.exports = {
  create: function(title, desc, src, year, month, day) {
    return {
      title: title,
      description: desc,
      source: src,
      year: year || 0,
      month: month || 0,
      day: day || 0
    };
  }
};