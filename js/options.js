// Extensions pages can all have access to the bacground page.
var bkg = chrome.extension.getBackgroundPage();

// When the DOM is loaded, make sure all the saved info is restored.
window.addEventListener('load', onLoad, false);

/**
 * When the options window has been loaded.
 */
function onLoad() {
  onRestore();
  $('button-save').addEventListener('click', onSave, false);
  $('button-close').addEventListener('click', onClose, false);
  $('button-choose-location').addEventListener('click', chooseLocation, false);
  $('button-mygeolocation').addEventListener('click', chooseMyLocation, false);
}

/**
 *  When the options window is closed;
 */
function onClose() {
  window.close();
}

/**
 * Saves options to localStorage.
 */
function onSave() {
  // Save settings.
  var lat = parseFloat($('latitude').value);
  var lng = parseFloat($('longitude').value);
  var position =  lat + ',' + lng;
  bkg.settings.opt_out = $('opt_out').checked;
  bkg.settings.currentPosition = position;
  bkg.settings.timeformat = $('timeformat').value;
  bkg.settings.calculation = $('calculation').value;
  bkg.settings.notificationVisible = $('notificationVisible').checked;
  bkg.settings.badgeVisible = $('badgeVisible').checked;
  
  // Reset badge if we do not want it to be visible.
  if (!bkg.settings.badgeVisible) {
    chrome.browserAction.setBadgeText({text: ''})
  }
  
  // Update visible time names.
  var timeNames = [];
  var timeNameNodes = document.getElementsByName('timenames');
  for (var i in timeNameNodes) {
    var timeNameNode = timeNameNodes[i];
    if (timeNameNode.checked) {
      timeNames.push(timeNameNode.id);
    }
  }
  bkg.settings.timenames = timeNames;
  
  // Update prayer settings.
  var entity = bkg.getPrayerEntity();
  var prayTime = entity.getPrayTime()
  prayTime.setMethod(bkg.settings.calculation);
  entity.setTimeFormat(bkg.settings.timeformat);
  bkg.alarm.setPrayerTimeNames(bkg.settings.timenames);
  entity.setLatitude(lat);
  entity.setLongitude(lng)
  
  // Refresh timetable to get new prayer time.
  var views = chrome.extension.getViews();
  for (var i in views) {
    var location = views[i].location;
    if (location.pathname == '/timetable.html') {
      location.reload();
    }
  }
  
  // Update status to let user know options were saved.
  var info = $('info-message');
  info.style.display = 'inline';
  info.style.opacity = 1;
  setTimeout(function() {
    info.style.opacity = 0.0;
  }, 1000);
}

/**
* Restore all options.
*/
function onRestore() {
  translateLabels();

  // Add calculations settings.
  var calculationElement = $('calculation');
  var entity = bkg.getPrayerEntity();
  calculationElement.add(createCalculationOption(entity, 'Jafari'));
  calculationElement.add(createCalculationOption(entity, 'Tehran'));
  calculationElement.add(createCalculationOption(entity, 'MWL'));
  calculationElement.add(createCalculationOption(entity, 'ISNA'));
  calculationElement.add(createCalculationOption(entity, 'Egypt'));
  calculationElement.add(createCalculationOption(entity, 'Makkah'));
  calculationElement.add(createCalculationOption(entity, 'Karachi'));
  
  // Add timenames group.
  var timenames = entity.getTimeNames();
  var timenamesgroup = $('timenamesgroup');
  timenamesgroup.appendChild(createTimenamesGroup([['Imsak', timenames.imsak],
                                                   ['Fajr', timenames.fajr], 
                                                   ['Sunrise', timenames.sunrise]]));
  timenamesgroup.appendChild(createTimenamesGroup([['Dhuhr', timenames.dhuhr], 
                                                   ['Asr', timenames.asr], 
                                                   ['Sunset', timenames.sunset]]));
  timenamesgroup.appendChild(createTimenamesGroup([['Maghrib', timenames.maghrib], 
                                                   ['Isha', timenames.isha], 
                                                   ['Midnight', timenames.midnight]]));
  
  // Restore settings.
  $('version').innerHTML = ' (v' + bkg.settings.version + ')';
  $('opt_out').checked = bkg.settings.opt_out;
  $('timeformat').value = bkg.settings.timeformat;
  $('calculation').value = bkg.settings.calculation;
  $('notificationVisible').checked = bkg.settings.notificationVisible;
  $('badgeVisible').checked = bkg.settings.badgeVisible;
  
  var position = bkg.settings.currentPosition;
  if (position) {
    var index = position.indexOf(',');
    var lat = parseFloat(position.substring(0, index));
    var lng = parseFloat(position.substring(index + 1, position.length));
    $('latitude').value = lat;
    $('longitude').value = lng;
  }
  
  // Show position on map.
  map = new GMap2($("map_canvas"));
  map.setCenter(new GLatLng(lat, lng), 13);
  var marker = new GMarker(new GPoint(lng, lat));
  map.addOverlay(marker);
              
  // Restore timenames.
  if (bkg.settings.timenames) {
    var timeNames = bkg.settings.timenames;
    for (var i in timeNames) {
      $(timeNames[i]).checked = true;
    }
  }
}

/**
 * Translations for labels.
 */
function translateLabels() {
  // Add a Warning to the top of this page asking for help if not english.
  chrome.i18n.getAcceptLanguages(function(languages) {
    for (var lang in languages) {
      if (languages[lang].indexOf('en') != 0) {
        // The user has a locale which isn't english, lets ask nicely for help.
        var helpGroup = $('extra-buttons-group');
       
        break;
      }
    }
  });

  // Set bidi direction.
  document.body.dir = chrome.i18n.getMessage('@@bidi_dir');
  
  // Title of the page.
  var header_title = chrome.i18n.getMessage('extName') + ' ' +
      chrome.i18n.getMessage('options');
  document.title = header_title;
    
  // Labels.
  $('header-label').innerHTML = header_title;
  $('options-warning-label').innerHTML = chrome.i18n.getMessage('optionsWarning');
  $('location-settings-label').innerHTML = chrome.i18n.getMessage('locationSettings');
  $('geolocation-label').innerHTML = chrome.i18n.getMessage('geolocation');
  $('latitude-label').value = chrome.i18n.getMessage('latitude');
  $('longitude-label').value = chrome.i18n.getMessage('longitude');
  $('button-choose-location').innerHTML = chrome.i18n.getMessage('chooseLocation');
  $('button-mygeolocation').innerHTML = chrome.i18n.getMessage('myGeoLocation');
  $('location-map-label').innerHTML = chrome.i18n.getMessage('locationOnMap');
  $('prayer-settings-label').innerHTML = chrome.i18n.getMessage('prayerSettings');
  $('time-format-label').innerHTML = chrome.i18n.getMessage('timeFormat');
  $('notification-label').innerHTML = chrome.i18n.getMessage('prayerNotifications');
  $('notification-visible-label').innerHTML = chrome.i18n.getMessage('notificationVisible');
  $('badge-visible-label').innerHTML = chrome.i18n.getMessage('badgeVisible');
  $('visible-timenames-label').innerHTML = chrome.i18n.getMessage('visibleTimenames');
  $('visible-timenames-info-label').innerHTML = chrome.i18n.getMessage('visibleTimenamesInfo');
  $('calculation-method-label').innerHTML = chrome.i18n.getMessage('calculationMethod');
  $('button-save').innerHTML = chrome.i18n.getMessage('save');
  $('button-close').innerHTML = chrome.i18n.getMessage('close');
  $('info-message').innerHTML = chrome.i18n.getMessage('optionSaveResponse');
  $('extension-by-label').innerHTML = chrome.i18n.getMessage('extBy');
  $('extension-source-label').innerHTML = chrome.i18n.getMessage('extSource');
  $('24h-label').innerHTML = chrome.i18n.getMessage('24hour');
  $('12h-label').innerHTML = chrome.i18n.getMessage('12hour');
  $('12hNS-label').innerHTML = chrome.i18n.getMessage('12hourNoSuffix');
  $('followme-label').innerHTML = chrome.i18n.getMessage('followMeTwitter');
  $('visit-extension-label').innerHTML = chrome.i18n.getMessage('visitExtensionPage');
  $('suggestions-label').innerHTML = chrome.i18n.getMessage('fileBugsSuggestions');
}

/**
 * Creates the DOM for the calculation option.
 * @param {Array<string>} An array of times.
 * @returns {HTMLElement} an paragraph element.
 */
function createTimenamesGroup(times) {
  var p = document.createElement('p');
  p.setAttribute('class', 'visibleTimeNamesList');
  for (var i in times) {
    var input = document.createElement('input');
    var time = times[i];
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'timenames');
    input.setAttribute('id', time[0]);
    p.appendChild(input);
    var label = document.createElement('label');
    label.setAttribute('for', time[0]);
    label.innerHTML = time[1];
    p.appendChild(label);
  }
  return p;
}

/**
 * Creates the DOM for the calculation option.
 *
 * @param {object<Entity>} entity The prayer entity.
 * @param {string} value The value of the calculation.
 * @returns {HTMLElement} an option element.
 */
function createCalculationOption(entity, value) {
  var option = document.createElement('option');
  option.text = entity.getCalculationName(value);
  option.value = value;
  return option;
}

/**
 * Using Geolocation API, get the user address automatically and graph it.
 */
function chooseMyLocation() {
  var entity = bkg.getPrayerEntity();
  entity.getGeolocation(function(lat, lng) {
    map.clearOverlays();
    map.setCenter(new GLatLng(lat, lng), 13);
    var marker = new GMarker(new GPoint(lng, lat));
    $('latitude').value = lat;
    $('longitude').value = lng;
    map.addOverlay(marker);
  });
}

/**
 * Enable editing mode so the user can input an address manually.
 */
function chooseLocation() {
  var locationDOM = $('locationSection');
  var gmapsDOM = document.createElement('div');
  gmapsDOM.setAttribute('id', 'gmaps');
  
  // Search input.
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('size', '60');
  input.setAttribute('id', 'address');
  input.setAttribute('placeholder', chrome.i18n.getMessage('searchPlaceholder'));
  gmapsDOM.appendChild(input);
  
  // Search button.
  var searchButton = document.createElement('button');
  searchButton.setAttribute('onclick', 'getAddress();');
  searchButton.innerHTML = chrome.i18n.getMessage('search');
  gmapsDOM.appendChild(searchButton);
  
  // Cancel button.
  var cancelButton = document.createElement('button');
  cancelButton.setAttribute('onclick', 'cancelAddress();');
  cancelButton.innerHTML = chrome.i18n.getMessage('cancel');
  gmapsDOM.appendChild(cancelButton);

  locationDOM.parentNode.appendChild(gmapsDOM);
  locationDOM.style.display = 'none';
}

/**
 * Cancel the editing mode for typing an address.
 */
function cancelAddress() {
  var locationDOM = $('locationSection');
  locationDOM.style.display = 'block';
  var gmapsDOM = $('gmaps');
  locationDOM.parentNode.removeChild(gmapsDOM);
}

/**
 * Using Google Maps API, get the current address typed in the text field.
 */
function getAddress() { 
  var address = $('address').value;
  var geocoder = new GClientGeocoder();
  geocoder.getLatLng(
    address,
    function(point) {
      if (!point) {
        alert(address + ' ' + chrome.i18n.getMessage('notFound'));
      } else {
        map.clearOverlays();
        map.setCenter(point, 13);
        var marker = new GMarker(point);
        map.addOverlay(marker);
        $('latitude').value = point.lat();
        $('longitude').value = point.lng();
        cancelAddress();
      }
    }
  );
}