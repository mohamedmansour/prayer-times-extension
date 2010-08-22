//--------------------- Copyright Block ----------------------
/* 

prayTime.js: Prayer Times Calculator (ver 1.2.1)
Copyright (C) 2007-2010 Hamid Zarrabi-Zadeh

Source: http://praytimes.org/
License: GNU General Public License, version 3

Permission is granted to use this code, with or without 
modification, in any website or application provided that 
the following conditions are met:

   1. Credit is given to the original work with a 
      link back to PrayTimes.org.

   2. Redistributions of the source code and its 
      translations into other programming languages 
      must retain this copyright notice.

This program is distributed in the hope that it will 
be useful, but WITHOUT ANY WARRANTY. 

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.
 

//--------------------- Help and Manual ----------------------

User's Manual: 
http://praytimes.org/manual

Calculating Formulas: 
http://praytimes.org/calculation

*/


//--------------------- PrayTime Class -----------------------

function PrayTime()
{

//--------------------- User Interface -----------------------
/* 

	getPrayerTimes (date, latitude, longitude, timeZone)
	getDatePrayerTimes (year, month, day, latitude, longitude, timeZone)

	setCalcMethod (methodID)
	setAsrMethod (methodID)

	setFajrAngle (angle)
	setMaghribAngle (angle)
	setIshaAngle (angle)
	setDhuhrMinutes (minutes)	// minutes after mid-day
	setMaghribMinutes (minutes)	// minutes after sunset
	setIshaMinutes (minutes)	// minutes after maghrib

	setHighLatsMethod (methodID)	// adjust method for higher latitudes

	setTimeFormat (timeFormat)	
	floatToTime24 (time)
	floatToTime12 (time)
	floatToTime12NS (time)

*/
//------------------------ Constants --------------------------


	// Calculation Methods
	this.Jafari     = 0;    // Ithna Ashari
	this.Karachi    = 1;    // University of Islamic Sciences, Karachi
	this.ISNA       = 2;    // Islamic Society of North America (ISNA)
	this.MWL        = 3;    // Muslim World League (MWL)
	this.Makkah     = 4;    // Umm al-Qura, Makkah
	this.Egypt      = 5;    // Egyptian General Authority of Survey
	this.Custom     = 6;    // Custom Setting
	this.Tehran     = 7;    // Institute of Geophysics, University of Tehran

	// Juristic Methods
	this.Shafii     = 0;    // Shafii (standard)
	this.Hanafi     = 1;    // Hanafi

	// Adjusting Methods for Higher Latitudes
	this.None       = 0;    // No adjustment
	this.MidNight   = 1;    // middle of night
	this.OneSeventh = 2;    // 1/7th of night
	this.AngleBased = 3;    // angle/60th of night


	// Time Formats
	this.Time24     = 0;    // 24-hour format
	this.Time12     = 1;    // 12-hour format
	this.Time12NS   = 2;    // 12-hour format with no suffix
	this.Float      = 3;    // floating point number 

	// Time Names
	this.timeNames = new Array(
		'Fajr',
		'Sunrise',
		'Dhuhr',
		'Asr',
		'Sunset',
		'Maghrib',
		'Isha'
	);

	this.InvalidTime = '-----';	 // The string used for invalid times


//---------------------- Global Variables --------------------


	this.calcMethod   = 0;		// caculation method
	this.asrJuristic  = 0;		// Juristic method for Asr
	this.dhuhrMinutes = 0;		// minutes after mid-day for Dhuhr
	this.adjustHighLats = 1;	// adjusting method for higher latitudes

	this.timeFormat   = 0;		// time format

	var lat;        // latitude 
	var lng;        // longitude 
	var timeZone;   // time-zone 
	var JDate;      // Julian date


//--------------------- Technical Settings --------------------


	this.numIterations = 1;		// number of iterations needed to compute times




//------------------- Calc Method Parameters --------------------


	this.methodParams = new Array();

	/*  this.methodParams[methodNum] = new Array(fa, ms, mv, is, iv);	
	
			fa : fajr angle
			ms : maghrib selector (0 = angle; 1 = minutes after sunset)
			mv : maghrib parameter value (in angle or minutes)
			is : isha selector (0 = angle; 1 = minutes after maghrib)
			iv : isha parameter value (in angle or minutes)
	*/

	this.methodParams[this.Jafari]	= new Array(16, 0, 4, 0, 14);		
	this.methodParams[this.Karachi]	= new Array(18, 1, 0, 0, 18);		
	this.methodParams[this.ISNA]	= new Array(15, 1, 0, 0, 15);		
	this.methodParams[this.MWL]     = new Array(18, 1, 0, 0, 17);		
	this.methodParams[this.Makkah]	= new Array(18.5, 1, 0, 1, 90);		
	this.methodParams[this.Egypt]	= new Array(19.5, 1, 0, 0, 17.5);		
	this.methodParams[this.Tehran]	= new Array(17.7, 0, 4.5, 0, 15);		
	this.methodParams[this.Custom]	= new Array(18, 1, 0, 0, 17);		

}	


//-------------------- Interface Functions --------------------


// return prayer times for a given date
PrayTime.prototype.getDatePrayerTimes = function(year, month, day, latitude, longitude, timeZone)
{
	this.lat = latitude;
	this.lng = longitude; 
	this.timeZone = this.effectiveTimeZone(year, month, day, timeZone); 
	this.JDate = this.julianDate(year, month, day)- longitude/ (15* 24);
	return this.computeDayTimes();
}

// return prayer times for a given date
PrayTime.prototype.getPrayerTimes = function(date, latitude, longitude, timeZone)
{
	return this.getDatePrayerTimes(date.getFullYear(), date.getMonth()+ 1, date.getDate(), 
				latitude, longitude, timeZone);
}

// set the calculation method 
PrayTime.prototype.setCalcMethod = function(methodID)
{
	this.calcMethod = methodID;
}

// set the juristic method for Asr
PrayTime.prototype.setAsrMethod = function(methodID)
{
	if (methodID < 0 || methodID > 1)
		return;
	this.asrJuristic = methodID;
}

// set the angle for calculating Fajr
PrayTime.prototype.setFajrAngle = function(angle)
{
	this.setCustomParams(new Array(angle, null, null, null, null));
}

// set the angle for calculating Maghrib
PrayTime.prototype.setMaghribAngle = function(angle)
{
	this.setCustomParams(new Array(null, 0, angle, null, null));
}

// set the angle for calculating Isha
PrayTime.prototype.setIshaAngle = function(angle)
{
	this.setCustomParams(new Array(null, null, null, 0, angle));
}

// set the minutes after mid-day for calculating Dhuhr
PrayTime.prototype.setDhuhrMinutes = function(minutes)
{
	this.dhuhrMinutes = minutes;
}

// set the minutes after Sunset for calculating Maghrib
PrayTime.prototype.setMaghribMinutes = function(minutes)
{
	this.setCustomParams(new Array(null, 1, minutes, null, null));
}

// set the minutes after Maghrib for calculating Isha
PrayTime.prototype.setIshaMinutes = function(minutes)
{
	this.setCustomParams(new Array(null, null, null, 1, minutes));
}

// set custom values for calculation parameters
PrayTime.prototype.setCustomParams = function(params)
{
	for (var i=0; i<5; i++)
	{
		if (params[i] == null)
			this.methodParams[this.Custom][i] = this.methodParams[this.calcMethod][i];
		else
			this.methodParams[this.Custom][i] = params[i];
	}
	this.calcMethod = this.Custom;
}

// set adjusting method for higher latitudes 
PrayTime.prototype.setHighLatsMethod = function(methodID)
{
	this.adjustHighLats = methodID;
}

// set the time format 
PrayTime.prototype.setTimeFormat = function(timeFormat)
{
	this.timeFormat = timeFormat;
}

// convert float hours to 24h format
PrayTime.prototype.floatToTime24 = function(time)
{
	if (isNaN(time))
		return this.InvalidTime;
	time = this.fixhour(time+ 0.5/ 60);  // add 0.5 minutes to round
	var hours = Math.floor(time); 
	var minutes = Math.floor((time- hours)* 60);
	return this.twoDigitsFormat(hours)+':'+ this.twoDigitsFormat(minutes);
}

// convert float hours to 12h format
PrayTime.prototype.floatToTime12 = function(time, noSuffix)
{
	if (isNaN(time))
		return this.InvalidTime;
	time = this.fixhour(time+ 0.5/ 60);  // add 0.5 minutes to round
	var hours = Math.floor(time); 
	var minutes = Math.floor((time- hours)* 60);
	var suffix = hours >= 12 ? ' pm' : ' am';
	hours = (hours+ 12 -1)% 12+ 1;
	return hours+':'+ this.twoDigitsFormat(minutes)+ (noSuffix ? '' : suffix);
}

// convert float hours to 12h format with no suffix
PrayTime.prototype.floatToTime12NS = function(time)
{
	return this.floatToTime12(time, true);
}



//---------------------- Calculation Functions -----------------------

// References:
// http://www.ummah.net/astronomy/saltime  
// http://aa.usno.navy.mil/faq/docs/SunApprox.html


// compute declination angle of sun and equation of time
PrayTime.prototype.sunPosition = function(jd)
{
	var D = jd - 2451545.0;
	var g = this.fixangle(357.529 + 0.98560028* D);
	var q = this.fixangle(280.459 + 0.98564736* D);
	var L = this.fixangle(q + 1.915* this.dsin(g) + 0.020* this.dsin(2*g));

	var R = 1.00014 - 0.01671* this.dcos(g) - 0.00014* this.dcos(2*g);
	var e = 23.439 - 0.00000036* D;

	var d = this.darcsin(this.dsin(e)* this.dsin(L));
	var RA = this.darctan2(this.dcos(e)* this.dsin(L), this.dcos(L))/ 15;
	RA = this.fixhour(RA);
	var EqT = q/15 - RA;

	return new Array(d, EqT);
}

// compute equation of time
PrayTime.prototype.equationOfTime = function(jd)
{
	return this.sunPosition(jd)[1];
}

// compute declination angle of sun
PrayTime.prototype.sunDeclination = function(jd)
{
	return this.sunPosition(jd)[0];
}

// compute mid-day (Dhuhr, Zawal) time
PrayTime.prototype.computeMidDay = function(t)
{
	var T = this.equationOfTime(this.JDate+ t);
	var Z = this.fixhour(12- T);
	return Z;
}

// compute time for a given angle G
PrayTime.prototype.computeTime = function(G, t)
{
	var D = this.sunDeclination(this.JDate+ t);
	var Z = this.computeMidDay(t);
	var V = 1/15* this.darccos((-this.dsin(G)- this.dsin(D)* this.dsin(this.lat)) / 
			(this.dcos(D)* this.dcos(this.lat)));
	return Z+ (G>90 ? -V : V);
}

// compute the time of Asr
PrayTime.prototype.computeAsr = function(step, t)  // Shafii: step=1, Hanafi: step=2
{
	var D = this.sunDeclination(this.JDate+ t);
	var G = -this.darccot(step+ this.dtan(Math.abs(this.lat-D)));
	return this.computeTime(G, t);
}


//---------------------- Compute Prayer Times -----------------------


// compute prayer times at given julian date
PrayTime.prototype.computeTimes = function(times)
{
	var t = this.dayPortion(times);

	var Fajr    = this.computeTime(180- this.methodParams[this.calcMethod][0], t[0]);
	var Sunrise = this.computeTime(180- 0.833, t[1]);  
	var Dhuhr   = this.computeMidDay(t[2]);
	var Asr     = this.computeAsr(1+ this.asrJuristic, t[3]);
	var Sunset  = this.computeTime(0.833, t[4]);;
	var Maghrib = this.computeTime(this.methodParams[this.calcMethod][2], t[5]);
	var Isha    = this.computeTime(this.methodParams[this.calcMethod][4], t[6]);

	return new Array(Fajr, Sunrise, Dhuhr, Asr, Sunset, Maghrib, Isha);
}


// compute prayer times at given julian date
PrayTime.prototype.computeDayTimes = function()
{
	var times = new Array(5, 6, 12, 13, 18, 18, 18); //default times

	for (var i=1; i<=this.numIterations; i++)   
		times = this.computeTimes(times);

	times = this.adjustTimes(times);
	return this.adjustTimesFormat(times);
}


// adjust times in a prayer time array
PrayTime.prototype.adjustTimes = function(times)
{
	for (var i=0; i<7; i++)
		times[i] += this.timeZone- this.lng/ 15;
	times[2] += this.dhuhrMinutes/ 60; //Dhuhr
	if (this.methodParams[this.calcMethod][1] == 1) // Maghrib
		times[5] = times[4]+ this.methodParams[this.calcMethod][2]/ 60;
	if (this.methodParams[this.calcMethod][3] == 1) // Isha
		times[6] = times[5]+ this.methodParams[this.calcMethod][4]/ 60;

	if (this.adjustHighLats != this.None)
		times = this.adjustHighLatTimes(times);
	return times;
}


// convert times array to given time format
PrayTime.prototype.adjustTimesFormat = function(times)
{
	if (this.timeFormat == this.Float)
		return times;
	for (var i=0; i<7; i++)
		if (this.timeFormat == this.Time12)
			times[i] = this.floatToTime12(times[i]); 
		else if (this.timeFormat == this.Time12NS)
			times[i] = this.floatToTime12(times[i], true); 
		else
			times[i] = this.floatToTime24(times[i]);
	return times;
}


// adjust Fajr, Isha and Maghrib for locations in higher latitudes
PrayTime.prototype.adjustHighLatTimes = function(times)
{
	var nightTime = this.timeDiff(times[4], times[1]); // sunset to sunrise

	// Adjust Fajr
	var FajrDiff = this.nightPortion(this.methodParams[this.calcMethod][0])* nightTime;
	if (isNaN(times[0]) || this.timeDiff(times[0], times[1]) > FajrDiff) 
		times[0] = times[1]- FajrDiff;

	// Adjust Isha
	var IshaAngle = (this.methodParams[this.calcMethod][3] == 0) ? this.methodParams[this.calcMethod][4] : 18;
	var IshaDiff = this.nightPortion(IshaAngle)* nightTime;
	if (isNaN(times[6]) || this.timeDiff(times[4], times[6]) > IshaDiff) 
		times[6] = times[4]+ IshaDiff;

	// Adjust Maghrib
	var MaghribAngle = (this.methodParams[this.calcMethod][1] == 0) ? this.methodParams[this.calcMethod][2] : 4;
	var MaghribDiff = this.nightPortion(MaghribAngle)* nightTime;
	if (isNaN(times[5]) || this.timeDiff(times[4], times[5]) > MaghribDiff) 
		times[5] = times[4]+ MaghribDiff;
	
	return times;
}


// the night portion used for adjusting times in higher latitudes
PrayTime.prototype.nightPortion = function(angle)
{
	if (this.adjustHighLats == this.AngleBased)
		return 1/60* angle;
	if (this.adjustHighLats == this.MidNight)
		return 1/2;
	if (this.adjustHighLats == this.OneSeventh)
		return 1/7;
}


// convert hours to day portions 
PrayTime.prototype.dayPortion = function(times)
{
	for (var i=0; i<7; i++)
		times[i] /= 24;
	return times;
}



//---------------------- Misc Functions -----------------------


// compute the difference between two times 
PrayTime.prototype.timeDiff = function(time1, time2)
{
	return this.fixhour(time2- time1);
}


// add a leading 0 if necessary
PrayTime.prototype.twoDigitsFormat = function(num)
{
	return (num <10) ? '0'+ num : num;
}



//---------------------- Julian Date Functions -----------------------


// calculate julian date from a calendar date
PrayTime.prototype.julianDate = function(year, month, day)
{
	if (month <= 2) 
	{
		year -= 1;
		month += 12;
	}
	var A = Math.floor(year/ 100);
	var B = 2- A+ Math.floor(A/ 4);

	var JD = Math.floor(365.25* (year+ 4716))+ Math.floor(30.6001* (month+ 1))+ day+ B- 1524.5;
	return JD;
}


// convert a calendar date to julian date (second method)
PrayTime.prototype.calcJD = function(year, month, day)
{
	var J1970 = 2440588.0;
	var date = new Date(year, month- 1, day);
	var ms = date.getTime();   // # of milliseconds since midnight Jan 1, 1970
	var days = Math.floor(ms/ (1000 * 60 * 60* 24)); 
	return J1970+ days- 0.5;
}


//---------------------- Time-Zone Functions -----------------------


// compute local time-zone for a specific date
PrayTime.prototype.getTimeZone = function(date) 
{
	var localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
	var GMTString = localDate.toGMTString();
	var GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ')- 1));
	var hoursDiff = (localDate- GMTDate) / (1000* 60* 60);
	return hoursDiff;
}


// compute base time-zone of the system
PrayTime.prototype.getBaseTimeZone = function() 
{
	return this.getTimeZone(new Date(2000, 0, 15))
}


// detect daylight saving in a given date
PrayTime.prototype.detectDaylightSaving = function(date) 
{
	return this.getTimeZone(date) != this.getBaseTimeZone();
}


// return effective timezone for a given date
PrayTime.prototype.effectiveTimeZone = function(year, month, day, timeZone)
{
	if (timeZone == null || typeof(timeZone) == 'undefined' || timeZone == 'auto')
		timeZone = this.getTimeZone(new Date(year, month- 1, day));
	return 1* timeZone;
}


//---------------------- Trigonometric Functions -----------------------

// degree sin
PrayTime.prototype.dsin = function(d)
{
    return Math.sin(this.dtr(d));
}

// degree cos
PrayTime.prototype.dcos = function(d)
{
    return Math.cos(this.dtr(d));
}

// degree tan
PrayTime.prototype.dtan = function(d)
{
    return Math.tan(this.dtr(d));
}

// degree arcsin
PrayTime.prototype.darcsin = function(x)
{
    return this.rtd(Math.asin(x));
}

// degree arccos
PrayTime.prototype.darccos = function(x)
{
    return this.rtd(Math.acos(x));
}

// degree arctan
PrayTime.prototype.darctan = function(x)
{
    return this.rtd(Math.atan(x));
}

// degree arctan2
PrayTime.prototype.darctan2 = function(y, x)
{
    return this.rtd(Math.atan2(y, x));
}

// degree arccot
PrayTime.prototype.darccot = function(x)
{
    return this.rtd(Math.atan(1/x));
}

// degree to radian
PrayTime.prototype.dtr = function(d)
{
    return (d * Math.PI) / 180.0;
}

// radian to degree
PrayTime.prototype.rtd = function(r)
{
    return (r * 180.0) / Math.PI;
}

// range reduce angle in degrees.
PrayTime.prototype.fixangle = function(a)
{
	a = a - 360.0 * (Math.floor(a / 360.0));
	a = a < 0 ? a + 360.0 : a;
	return a;
}

// range reduce hours to 0..23
PrayTime.prototype.fixhour = function(a)
{
	a = a - 24.0 * (Math.floor(a / 24.0));
	a = a < 0 ? a + 24.0 : a;
	return a;
}


//---------------------- prayTime Object -----------------------
prayTime = new PrayTime();