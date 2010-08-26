/**
 * A Geolocated based prayer times that uses HTML5 geolocation features
 * to find out the prayers.
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
  this.callback = null;
};

/**
 * Retrieves the geolocated data and calculates the new prayer times.
 * @param {function} callback The callback that gets fired when positional data
 *                            has been retrieved.
 */
GeoPrayerTimes.prototype.getGeolocation = function(callback)
{
  this.loaded = false;
  this.callback = callback;
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
  this.callback.call(this, this.latitude, this.longitude);
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
  return prayTimes.getTimes(this.date,
                            [this.latitude, this.longitude],
                            this.timezone, 0);
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
  return prayTimes;
};

/**
 * Returns the current latitude present.
 * @return {float} A latitude
 */
GeoPrayerTimes.prototype.getLatitude = function()
{
  return this.latitude;
};

/**
 * Sets the current latitude present.
 * @param {float} val A latitude
 */
GeoPrayerTimes.prototype.setLatitude = function(val)
{
  this.latitude = val;
};

/**
 * Returns the current longitude present.
 * @return {float} A longitude
 */
GeoPrayerTimes.prototype.getLongitude = function()
{
  return this.longitude;
};

/**
 * Sets the current longitude present.
 * @param {float} val A longitude
 */
GeoPrayerTimes.prototype.setLongitude = function(val)
{
  this.longitude = val;
};

/**
 * Returns the current timezone present.
 * @return {number} A timezone
 */
GeoPrayerTimes.prototype.getTimezone = function()
{
  return this.timezone;
};

/**
 * Checks is the geolocation functionality has been completed and loaded
 * @return {boolean} true if geodata retrieved.
 */
GeoPrayerTimes.prototype.isLoaded = function()
{
  return this.loaded;
};

/**
 * Calculation method name.
 * @return {string} The calculation method.
 */
GeoPrayerTimes.prototype.getCalculationName = function(method)
{
  return prayTimes.getMethodName(method);
};