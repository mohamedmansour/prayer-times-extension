/**
 * A Geolocated based prayer times that uses HTML5 geolocation features
 * to find out the prayers.
 *
 * @constructor
 */
GeoPrayerTimes = function()
{
  this.latitude = NaN;
  this.longitude = NaN;
  this.times = null;
  this.date = null;
  this.timezone = -5;
  this.loaded = false;
};

/**
 * Retrieves the geolocated data and calculates the new prayer times.
 */
GeoPrayerTimes.prototype.getGeolocation = function()
{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.successHandler.bind(this),
                                             this.errorHandler.bind(this));
  } else {
    error('not supported');
  }
};

/**
 * Callback when error occured.
 * @param {object} msg The error message, can be an object as well.
 */
GeoPrayerTimes.prototype.errorHandler = function(msg)
{
  console.log(msg);
};

/**
 * Callback when geo success.
 * @param {object} position The positional geo data.
 */
GeoPrayerTimes.prototype.successHandler = function(position)
{
  this.latitude = position.coords.latitude;
  this.longitude = position.coords.longitude;
  this.loaded = true;
};

/**
 * The current prayer times based on a date.
 * @param {date} The date to get the prayer times for.
 * @return {array<string>}  An array of times.
 */
GeoPrayerTimes.prototype.getTimes = function(opt_date)
{
  this.date = opt_date || new Date();
  this.timezone = -this.date.getTimezoneOffset() / 60;
  return prayTime.getPrayerTimes(this.date,
                                  this.latitude,
                                  this.longitude,
                                  this.timezone);
};

/**
 * The current prayer time stored date.
 * @return {array<string>}  An array of times.
 */
GeoPrayerTimes.prototype.getDate = function()
{
  return this.date;
};

/**
 * Return the prayTime instance that does the calculations.
 * @return {object} The PrayTime object.
 */
GeoPrayerTimes.prototype.getPrayTime = function()
{
  return prayTime;
};

GeoPrayerTimes.prototype.getLatitude = function()
{
  return this.latitude;
};

GeoPrayerTimes.prototype.getLongitude = function()
{
  return this.longitude;
};

GeoPrayerTimes.prototype.getTimezone = function()
{
  return this.timezone;
};