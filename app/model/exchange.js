'use strict';
module.exports = {
  create: function(fromObj) {
    var month = parseInt(fromObj['month'], 10);
    var day = parseInt(fromObj['day'], 10);
    var latitude = parseInt(fromObj['latitude'], 10);
    var longitude = parseInt(fromObj['longitude'], 10);
    return {
      title: fromObj['title'],
      description: fromObj['description'],
      location_str: fromObj['location'] || fromObj['location_str'],
      source: fromObj['source'],
      year: fromObj.hasOwnProperty('year') ? fromObj['year'] : undefined,
      month: isNaN(month) ? -1 : month,
      day: isNaN(day) ? -1 : day,
      latitude: isNaN(latitude) ? undefined : latitude,
      longitude: isNaN(longitude) ? undefined : longitude
    };
  }
};