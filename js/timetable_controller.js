/**
 * Timetable controller.
 *
 * @param {string} timetableID The view id to render.
 * @constructor
 */
TimetableController = function(timetableID)
{
  this.bkg_ = chrome.extension.getBackgroundPage();
  this.entity_ = this.bkg_.controller.getPrayerEntity();
  this.settings_ = this.bkg_.settings;
  this.model_ = new TimetableModel(this.entity_, timetableID);
};

/**
 * Initializes the View.
 */
TimetableController.prototype.init = function()
{
  this.translateView();
  
  $('version').innerHTML = ' (v' + this.settings_.version + ')';
  $('calculation').innerHTML = this.entity_.getCalculationName(this.settings_.calculation);
  
  // Events initialization.
  $('options-link').addEventListener('click', this.onVisitOptions.bind(this), false);
  $('button-next').addEventListener('click', this.onNext.bind(this), false);
  $('button-prev').addEventListener('click', this.onPrevious.bind(this), false);
  
  // View the current month.
  this.model_.viewMonth(0);
};

/**
 * Translate the timetable view.
 */
TimetableController.prototype.translateView = function()
{
  // Set bidi direction.
  document.body.dir = chrome.i18n.getMessage('@@bidi_dir');
  var prayerTimetableTranslation = chrome.i18n.getMessage('prayerTimetable');
  document.title = prayerTimetableTranslation;
  var timetableText = document.getElementsByClassName('prayertimetable');
  for (var i in timetableText) {
    timetableText[i].innerHTML = prayerTimetableTranslation;
  }
  $('precaution').innerHTML = chrome.i18n.getMessage('timePrecaution');
  $('button-next').innerHTML = chrome.i18n.getMessage('next') + '&raquo;';
  $('button-prev').innerHTML = '&laquo;' + chrome.i18n.getMessage('previous');
  $('calculation-method-label').innerHTML = chrome.i18n.getMessage('calculationMethod');
  $('options-link').innerHTML = chrome.i18n.getMessage('options');
  $('extension-by-label').innerHTML = chrome.i18n.getMessage('extBy');
  $('extension-source-label').innerHTML = chrome.i18n.getMessage('extSource');
  $('followme-label').innerHTML = chrome.i18n.getMessage('followMeTwitter');
};

/**
 * Visit Options window.
 */
TimetableController.prototype.onVisitOptions = function()
{
  this.bkg_.controller.openSingletonPage(chrome.extension.getURL('options.html'));
  return false;
};

 
/**
 * View next month.
 */
TimetableController.prototype.onNext = function() 
{
  this.model_.viewMonth(+1);
};

/**
 * View previous month.
 */
TimetableController.prototype.onPrevious = function() 
{
  this.model_.viewMonth(-1);
};