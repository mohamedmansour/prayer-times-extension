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
  this.timeFormat = null;
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
    this.errorHandler('not supported');
  }
};

/**
 * Callback when error occured.
 * @param {object} msg The error message, can be an object as well.
 */
GeoPrayerTimes.prototype.errorHandler = function(msg)
{
  alert(msg);
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
GeoPrayerTimes.prototype.getTimes = function(opt_date, opt_format)
{
  date = opt_date || new Date();
  format = opt_format || this.timeFormat;
  return prayTimes.getTimes(date, [this.latitude, this.longitude], 'auto', 'auto', format);
};

/**
 * Sets the timeformat for the personalized times.
 * @param {string} format The time format to set, usually 24h, 12h
 */
GeoPrayerTimes.prototype.setTimeFormat = function(format)
{
  this.timeFormat = format;
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
 * Checks is the geolocation functionality has been completed and loaded
 * @return {boolean} true if geodata retrieved.
 */
GeoPrayerTimes.prototype.isLoaded = function()
{
  return this.loaded;
};

/**
 * Sets the loaded parameter to distinguish that lat and long exists.
 * @param {boolean} val true if geodata retrieved.
 */
GeoPrayerTimes.prototype.setLoaded = function(val)
{
  this.loaded = val;
};

/**
 * Calculation method name.
 * @return {string} The calculation method.
 */
GeoPrayerTimes.prototype.getCalculationName = function(method)
{
  return prayTimes.getMethodName(method);
};

/**
 * @return {Array<string>} The timenames in order.
 */
GeoPrayerTimes.prototype.getTimeNames = function()
{
  return prayTimes.getTimeNames();
};