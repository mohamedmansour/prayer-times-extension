var AlarmCalcs = function  (){
    var times,  prayerTimeNames, nextPrayerTime;
    var flag = true; //give Alarm?
    function reset(){
        times = entity.getTimes();
        prayerTimeNames = {
            fajr     : chrome.i18n.getMessage('fajr'),
            dhuhr    : chrome.i18n.getMessage('dhuhr'),
            asr      : chrome.i18n.getMessage('asr'),
            maghrib  : chrome.i18n.getMessage('maghrib'),
            isha     : chrome.i18n.getMessage('isha')
        };
        nextPrayerTime = {
            time : times.fajr,
            name : chrome.i18n.getMessage('fajr'),
            delta : (1.0*sTimeMinutes(times.fajr) + 24*60 - cTimeMinites())
        };
    }   
    var init = function(){
        reset();
        var crMinutes = cTimeMinites(); //current time in minutes from day beginning
        var delta = -1;
        for(i in prayerTimeNames){
            var prMinutes = sTimeMinutes(times[i]); //prayer time in minutes from day beginning
            delta = prMinutes - crMinutes;
            //if delta became >0 then we found next prayer

            if(delta>=0){
                nextPrayerTime.delta = delta;
                nextPrayerTime.name = prayerTimeNames[i];
                nextPrayerTime.time = times[i];
                if(delta<1){
                    if(flag){
                        //Set timer for making alarm in 0-1 minite after time arriving
                        alert("timeout!");
                        window.setTimeout(makeAlarm, 60000, "title", "body");
                        flag = false;
                    }
                } else {
                    flag = true;
                }
                break;
            //exit from loop
            }
        }
        window.setTimeout(init ,4000);
    }
    function cTimeMinites(){
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        return (60 * h + m);
    }
    function sTimeMinutes(s){
        var h = 1.0 * s.split(":")[0];
        var m = 1.0 * s.split(":")[1];
        return (60 * h + m);
    }

    function makeAlarm(title, body, type){
        // Create a simple text notification:
        var notification = webkitNotifications.createNotification(
            'img/icon48.png',  // icon url - can be relative
            title,  // notification title
            body  // notification body text
            );

        // Then show the notification.
        notification.show();
        
    }
    return {
        initAlarm: init,
    }
}
