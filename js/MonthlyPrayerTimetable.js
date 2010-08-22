
MonthlyPrayerTimetable = function(entity, id)
{
  this.id = id;
  this.entity = entity;
	this.currentDate = new Date();
};

MonthlyPrayerTimetable.prototype.viewMonth = function(offset)
{
  var lat = entity.getLatitude();
  var lng = entity.getLongitude();
  var timezone = entity.getTimezone();

  this.currentDate.setMonth(this.currentDate.getMonth() + 1 * offset);
  var month = this.currentDate.getMonth();
  var year = this.currentDate.getFullYear();
  var title = this._monthFullName(month)+ ' '+ year;
  document.getElementById('table-title').innerHTML = title;
  this._makeTable(year, month);
};
 
// make monthly timetable
MonthlyPrayerTimetable.prototype._makeTable = function(year, month)
{
  var table = document.getElementById(this.id); 
  var tbody = document.createElement('tbody');
  
  var timeTags = this.entity.getPrayTime().timeNames.slice(0);
  timeTags.unshift('Day');
  tbody.appendChild(this._makeTableRow(timeTags, 'head-row'));

  var date = new Date(year, month, 1);
  var endDate = new Date(year, month + 1, 1);
  var index = 1;
  while (date < endDate) {
    var times = this.entity.getTimes(date);
    times.unshift(date.getDate()); // add day number
    var today = new Date(); 
    var isToday = (date.getMonth() == today.getMonth()) &&
        (date.getDate() == today.getDate());
    tbody.appendChild(this._makeTableRow(times, isToday ? 'today-row' :
       (index & 1) == 0 ? 'even-row' : 'odd-row'));
    date.setDate(date.getDate() + 1);  // next day
    index++;
  }
  this._removeChildrenOfNode(table);
  table.appendChild(tbody);
};
 
// make a table row
MonthlyPrayerTimetable.prototype._makeTableRow = function(items, clazz)
{
  var row = document.createElement('tr');
  row.setAttribute('class', clazz);
  for (var i=0; i< items.length; i++) {
    var cell = document.createElement('td');
    cell.innerHTML = items[i];
    cell.width = i == 0 ? 25 : 40;
    row.appendChild(cell);
  }
  return row;		
}
 
// remove all children of a node
MonthlyPrayerTimetable.prototype._removeChildrenOfNode = function(node)
{
  if (node == undefined || node == null)
    return;

  while (node.firstChild)
    node.removeChild(node.firstChild);
};
 
// return month full name
MonthlyPrayerTimetable.prototype._monthFullName = function(month)
{
  var monthName = new Array('January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December');
  return monthName[month];
};