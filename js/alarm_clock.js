/**
 * Prayer Alarm Clock Calculations.
 *
 * Contributed by:
 *   Dmitri Babaev
 */
AlarmCalcs = function(entity)
{
  this.entity = entity;
  this.times = null;
  this.nowPrayerTimeLabel = chrome.i18n.getMessage('nowPrayerTime');
  this.prayerTimeNames = settings.timenames;
  this.nextPrayerTime = null;
  this.flag = true; // Give Alarm?
};

/**
 * Update the local cache of the prayer time names.
 */
AlarmCalcs.prototype.setPrayerTimeNames = function(times)
{
  this.prayerTimeNames = times;
};

/**
 * Resets the Alarm Clock to Fajr.
 */
AlarmCalcs.prototype.reset = function()
{
  this.times = this.entity.getTimes(null, '24h');
  var timeName = this.prayerTimeNames[0];
  var time = this.times[timeName.toLowerCase()];
  this.nextPrayerTime = {
      time : time,
      name : timeName,
      delta : (1.0 * this.dateStringInMinutes(time) + 24 * 60 - this.currentTimeInMinutes())
  };
};

/**
 * Starts the Alarm Clock to figure out when the next prayer is.
 */
AlarmCalcs.prototype.start = function()
{
  this.reset();
  // Current time in minutes from day beginning
  var crMinutes =  this.currentTimeInMinutes();
  var delta = -1;
  for (var i in this.prayerTimeNames) {
    var timeName = this.prayerTimeNames[i];
    var time = this.times[timeName.toLowerCase()];

    // Prayer time in minutes from day beginning
    var prMinutes =  this.dateStringInMinutes(time);
    delta = prMinutes - crMinutes;

    // If delta became >0 then we found next prayer
    if (delta >= 0) {
      this.nextPrayerTime.delta = delta;
      this.nextPrayerTime.name = timeName;
      this.nextPrayerTime.time = time;
      if (delta == 0) {
        if (this.flag) {
          this.makeAlarm(this.getNextPrayerName(), this.nowPrayerTimeLabel +
                          ' ' + this.getNextPrayerName());
          this.flag = false;
        }
      } else {
        this.flag = true;
      }
      break;
    }
  }
  this.makeBadge();
  window.setTimeout(this.start.bind(this), 4000);
};

/**
 * The Current Time in Minutes.
 */
AlarmCalcs.prototype.currentTimeInMinutes = function()
{
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  return 60 * h + m;
};

/**
 * From the given date string, returns the number of minutes.
 */
AlarmCalcs.prototype.dateStringInMinutes = function(s)
{
  var h = 1.0 * s.split(':')[0];
  var m = 1.0 * s.split(':')[1];
  return 60 * h + m;
};

/**
 * Creates the HTML5 Notification payload and shows it.
 *
 * @param {string} title The title of the HTML5 notification.
 * @param {string} body The description that will be shown in the body of the 
 *                      notification.
 */
AlarmCalcs.prototype.makeAlarm = function(title, body)
{
  if (!settings.notificationVisible) {
    return;
  }

  // Create a simple text notification:
  var notification = webkitNotifications.createNotification(
      'img/icon48.png',  // icon url - can be relative
      title,             // notification title
      body               // notification body text
  );

  // Then show the notification.
  notification.show();
};

/**
 * Creates and updates the Chrome Badge Text.
 * Always change the title, but decide whether to show the badge.
 */
AlarmCalcs.prototype.makeBadge = function()
{
  chrome.browserAction.setTitle({title: this.getNextPrayerName()});
  
  if (!settings.badgeVisible) {
    return;
  }

  chrome.browserAction.setBadgeText({text: this.getNextPrayerTime()});
};

/**
 * Formatted time to next prayer
 */
AlarmCalcs.prototype.getNextPrayerTime = function()
{
  var h = Math.floor(this.nextPrayerTime.delta / 60);
  var m = this.nextPrayerTime.delta - 60 * h;
  var s = (m < 10) ? (h + ':0' + m) : (h + ':' + m);
  return s;
};

/**
 * Name of next prayer
 */
AlarmCalcs.prototype.getNextPrayerName = function()
{
  return this.nextPrayerTime.name;
};
