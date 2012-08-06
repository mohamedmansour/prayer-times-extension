/**
 * This formula takes from http://www.phpclasses.org/browse/package/705.html
 * Thanks to Ben Yacoub Hatem
 */
IslamicDate = function () {
	this.edate = new Date();
};

/**
 * Gets the current Hijri Date.
 *
 * @param {Date} opt_date The optional date that will need conversion.
 * @return {string} The Hijri Date.
 */
IslamicDate.prototype.getHijriDate = function (opt_date) {
		date = opt_date || this.edate
		var y = date.getFullYear();
		var m = (date.getMonth()+1);
		var d = date.getDate();
		var l,n,j,jd;
		
		iMonthName = new Array();
		
		iMonthName[1]  = 'Muharram';       //29
		iMonthName[2]  = 'Safar';          //30
		iMonthName[3]  = 'Rabi\' 1';       //30
		iMonthName[4]  = 'Rabi\' 2';       //29
		iMonthName[5]  = 'Jumada 1';       //29
		iMonthName[6]  = 'Jumada 2';       //30
		iMonthName[7]  = 'Rajab';          //29
		iMonthName[8]  = 'Sha\'aban';      //30
		iMonthName[9]  = 'Ramadan';        //29
		iMonthName[10] = 'Shawwal';        //30
		iMonthName[11] = 'Dhu al-Qi\'dah'; //29
		iMonthName[12] = 'Dhu al-Hijjah';  //30
		
		// 1428H 30 29 29 30 29 29 30 30 30 29 30 29
		// 1429H 30 29 30 29 29 30 29 29 30 30 29 30
		// 1430H 29 30 30 29 29 30 29 30 29 30 29 30
		// 1431H 29 30 30 29 30 29 30 29 30 29 29 30
		// 1432H 29 30 30 30 29 30 29 30 29 30 29 29
		// 1433H 30 29 30 30 29 30 30 29 30 29 30 29
		// 1434H 29
		if (( y > 1582 ) || (( y == 1582 ) && ( m > 10 )) || (( y == 1582 ) && ( m == 10 ) && ( d > 14 ))) {
			jd = parseInt(( 1461 * ( y + 4800 + parseInt(( m - 14 ) / 12 )))/ 4) + parseInt(( 367 * ( m - 2 - 12 * (parseInt(( m - 14 ) / 12)))) / 12) - parseInt(( 3 * (parseInt(( y + 4900+ parseInt(( m - 14) / 12) ) / 100))) / 4)+ d - 32075;
		} else {
			jd = 367 * y - parseInt(( 7 * ( y + 5001 + parseInt(( m - 9 ) / 7))) / 4) + parseInt(( 275 * m) / 9) + d + 1729777;
		}
		
		l = jd - 1948440 + 10632;
		n = parseInt(( l - 1 ) / 10631);
		l = l - 10631 * n + 354;
		j = ( parseInt(( 10985 - l ) / 5316)) * ( parseInt(( 50 * l) / 17719)) + ( parseInt( l / 5670 )) * ( parseInt(( 43 * l ) / 15238 ));
		l = l - ( parseInt(( 30 - j ) / 15 )) * ( parseInt(( 17719 * j ) / 50)) - ( parseInt( j / 16 )) * ( parseInt(( 15238 * j ) / 43 )) + 29;
		m = parseInt(( 24 * l ) / 709 );
		d = l - parseInt(( 709 * m ) / 24);
		y = 30 * n + j - 30;
		
		var lab = d + ' ' + iMonthName[m] + ' ' + y;
		return lab;
};	

