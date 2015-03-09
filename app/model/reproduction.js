'use strict';
module.exports = {
  create: function(fromObj) {
    var month = parseInt(fromObj['month'], 10);
    var day = parseInt(fromObj['day'], 10);
    var latitude = parseInt(fromObj['latitude'], 10);
    var longitude = parseInt(fromObj['longitude'], 10);
    var latitudeOriginal = parseInt(fromObj['latitude_original'], 10);
    var longitudeOriginal = parseInt(fromObj['longitude_original'], 10);
    var latitudeMade = parseInt(fromObj['latitude_made'], 10);
    var longitudeMade = parseInt(fromObj['longitude_made'], 10);
    return {
      title: fromObj['title'],
      copy: fromObj['copy'],
      copy_of: fromObj['copy_of'],
      location_str: fromObj['location'] || fromObj['location_str'],
      latitude: isNaN(latitude) ? undefined : latitude,
      longitude: isNaN(longitude) ? undefined : longitude,
      location_original_str: fromObj['location_original_str'],
      latitude_original: isNaN(latitudeOriginal) ? undefined : latitudeOriginal,
      longitude_original: isNaN(longitudeOriginal) ? undefined : longitudeOriginal,
      location_made_str: fromObj['location_made_str'],
      latitude_made: isNaN(latitudeMade) ? undefined : latitudeMade,
      longitude_made: isNaN(longitudeMade) ? undefined : longitudeMade,
      maker_author: fromObj['maker_author'],
      publisher: fromObj['publisher'],
      medium: fromObj['medium'],
      month: isNaN(month) ? -1 : month,
      day: isNaN(day) ? -1 : day,
      year: fromObj.hasOwnProperty('year') ? fromObj['year'] : undefined,
      copy_of_gift: fromObj['copy_of_gift'],
      motifs: fromObj['motifs'],
      source: fromObj['source'],
      notes: fromObj['notes]']
    };
  }
};