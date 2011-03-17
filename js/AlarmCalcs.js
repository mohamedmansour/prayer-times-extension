var AlarmCalcs = function  (){
    var NextPrayer = {
        "time" : "",
        "name" : "",
        "type" : 2, //0 - prayer, 1 - not prayer, 2 - initial value
        "delta" : 1000 //time to prayer
    };
    var CurrentPrayer = {
        "time" : "",
        "name" : "",
        "type" : 2, //0 - намаз, 1 - не намаз, 2 - не инициализировано
        "delta" : 1000 //time from prevous prayer
    }  /*  Устанавливаем параметры
                 */
    var flag = 0; //0 - еще не выдавались сообщения о наступлении нового времени
    var nextTimeInfo = function(){
        return (NextPrayer.name + " " + NextPrayer.delta);
    }
    var currentTimeInfo = function(){
        return (CurrentPrayer.name + " " + CurrentPrayer.delta);
    }
    var flagInfo  = function(){
        return (flag);
    }
    var init = function(){
        var i = 0;
        var times = entity.getTimes();
        var timenames = entity.getTimeNames();
        var list = settings.timenames;
        NextPrayer.delta = 10000;
        CurrentPrayer.delta = 10000;
        for(var i in list) {
            var listItem = list[i].toLowerCase();
            var minutes_namaz =  sTimeMinutes(times[listItem]);
            var minutes_ctime =  cTimeMinites();
            var delta;
            var delta1;
            delta = minutes_namaz - minutes_ctime; // ищем следующее время
            //ищем текущее время
            delta1 = minutes_ctime - minutes_namaz;
            if ((delta<NextPrayer.delta) && (delta>=0)){
                NextPrayer.delta = delta;
                NextPrayer.time = times[listItem];
                NextPrayer.name = timenames[listItem];
            }
            if ((delta1<CurrentPrayer.delta) && (delta1>=0)){
                CurrentPrayer.delta = delta1;
                CurrentPrayer.time = times[listItem];
                CurrentPrayer.name = timenames[listItem];
            }
        }
        if(CurrentPrayer.delta<10){
            makeAlarm(CurrentPrayer.name, chrome.i18n.getMessage('nowPrayerTime')+ " " + CurrentPrayer.name);
        } else {
            flag = 0;
        }
        window.setTimeout(init, 60001);
    }
    function is_namaz_time (namaz){
        var namaz_array = [
        "fajr", "dhuhr", "asr", "maghrib", "isha"
        ];
        var i = namaz_array.length;
        while (i--) {
            if (namaz_array[i] === namaz) {
                return true;
            }
        }
        return false;
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
        if (flag == 0) {
            var notification = webkitNotifications.createNotification(
                'img/icon48.png',  // icon url - can be relative
                title,  // notification title
                body  // notification body text
                );

            // Then show the notification.
            notification.show();
            flag = 1;
        }
        
    }
    return {
        initAlarm: init,
        currentTime: currentTimeInfo,
        nextTime:nextTimeInfo,
        flagShow:flagInfo
    }
}
