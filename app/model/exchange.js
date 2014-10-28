'use strict';
module.exports = {
  create: function(title, desc, src, location, year, month, day) {
    return {
      title: title,
      description: desc,
      location_str: location,
      source: src,
      year: year ? parseInt(year, 10) : 0,
      month: month ? parseInt(month, 10) : 0,
      day: day ? parseInt(day, 10) : 0
    };
  }
};