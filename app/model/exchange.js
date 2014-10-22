'use strict';
module.exports = {
  create: function(title, desc, src, location, year, month, day) {
    return {
      title: title,
      description: desc,
      location_str: location,
      source: src,
      year: year || 0,
      month: month || 0,
      day: day || 0
    };
  }
};