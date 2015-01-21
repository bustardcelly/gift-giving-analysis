'use strict';
module.exports = {
  inflate: function(fromObj) {
    var month = parseInt(fromObj['month'], 10);
    var day = parseInt(fromObj['day'], 10);
    var latitude = parseInt(fromObj['latitude'], 10);
    var longitude = parseInt(fromObj['longitude'], 10);
    return {
      title: fromObj['title'],
      copy: fromObj['copy'],
      location_str: fromObj['location'],
      maker_author: fromObj['maker_author'],
      publisher: fromObj['publisher'],
      medium: fromObj['medium'],
      month: isNaN(month) ? -1 : month,
      day: isNaN(day) ? -1 : day,
      year: fromObj.hasOwnProperty('year') ? fromObj['year'] : undefined,
      copy_of_gift: fromObj['copy_of_gift'],
      motifs: fromObj['motifs'],
      latitude: isNaN(latitude) ? undefined : latitude,
      longitude: isNaN(longitude) ? undefined : longitude,
      source: fromObj['source'],
      notes: fromObj['notes]']
    };
  }
};