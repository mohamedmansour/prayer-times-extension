/**
 * Create monthly prayers timetable.
 *
 * @param {GeoPrayerTime} entity The prayer time entity.
 * @param {string} id The element id where the table exists.
 */
MonthlyPrayerTimetable = function(entity, id, timeNames)
{
  this.id = id;
  this.entity = entity;
	this.currentDate = new Date();
	this.timeNames = this._translateTimeNames(timeNames);
};

/**
 * Display monthly timetable from the given |offset|.
 *
 * @param {number} offset The month offset starting by 0 for January.
 */
MonthlyPrayerTimetable.prototype.viewMonth = function(offset)
{
  this.currentDate.setMonth(this.currentDate.getMonth() + 1 * offset);
  var month = this.currentDate.getMonth();
  var year = this.currentDate.getFullYear();
  var title = this._monthFullName(month)+ ' ' + year;
  document.getElementById('table-title').innerHTML = title;
  this._createTable(year, month);
};

/**
 * Translates the current timenames.
 * @param {Array<string>} data the timenames saved in localstorage.
 * @returns {Array<string>} the translated timenames.
 */
MonthlyPrayerTimetable.prototype._translateTimeNames = function(data) {
  var timenames = this.entity.getTimeNames();
  var translatedNames = [];
  for (var i in data) {
    translatedNames.push(timenames[data[i].toLowerCase()]);
  }
  return translatedNames;
};

/**
 * Create monthly timetable based on todays date.
 *
 * @param {number} year The year to base.
 * @param {month} month The month to base.
 */
MonthlyPrayerTimetable.prototype._createTable = function(year, month)
{
  var items = ['Day'];
  for (var i in this.timeNames) {
    items.push(this.timeNames[i]);
  }

  var table = document.getElementById(this.id); 
  var tbody = document.createElement('tbody');
  tbody.appendChild(this._createTableHeader(items));

  var date = new Date(year, month, 1);
  var endDate = new Date(year, month + 1, 1);
  var index = 1;

  while (date < endDate) {
    var times = this.entity.getTimes(date);
    times.day = date.getDate();
    var today = new Date(); 
    var isToday = (date.getMonth() == today.getMonth()) &&
        (date.getDate() == today.getDate());
    var klass = isToday ? 'today-row' : (index & 1) == 0 ?
        'even-row' : 'odd-row';
    tbody.appendChild(this._createTableRow(times, items, klass));
    date.setDate(date.getDate() + 1);  // next day
    index++;
  }
  this._removeAllChild(table);
  table.appendChild(tbody);
};

/**
 * Create the header row.
 * @param {Array<string>} data The headers to print.
 */
MonthlyPrayerTimetable.prototype._createTableHeader = function(data) {
  var row = document.createElement('tr');
  for (var i in data) {
    var cell = document.createElement('td');
    cell.innerHTML = data[i];
    row.appendChild(cell);
  }
  row.className = 'head-row';
  return row;		
};

/**
 * Create a table row given the data.
 * @param {dictionary} data The date to fetch the items.
 * @param {Array<string>} items The items for the given row.
 * @param {string} clazz The classname for the row.
 */
MonthlyPrayerTimetable.prototype._createTableRow = function(data, items, clazz)
{
  var row = document.createElement('tr');
  for (var i in items) {
    var cell = document.createElement('td');
    cell.innerHTML = data[items[i].toLowerCase()];
    row.appendChild(cell);
  }
  row.className = clazz;
  return row;		
};

/**
 * Remove all children from a node.
 * @param {Node} node the document element node.
 */
MonthlyPrayerTimetable.prototype._removeAllChild = function(node)
{
  if (node == undefined || node == null)
    return;

  while (node.firstChild)
    node.removeChild(node.firstChild);
};

/**
 * Return the month name given its offset, where 0 is January.
 * @param {number} month the offset of the month.
 */
MonthlyPrayerTimetable.prototype._monthFullName = function(month)
{
  var monthName = new Array('January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December');
  return monthName[month];
};