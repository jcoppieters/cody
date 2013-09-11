/**
 * Created with JetBrains WebStorm.
 * User: Dieter Beelaert
 * Date: 23/08/13
 * Time: 11:42
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    localize();
});

function localize(){
    $(".newEvent").html(localization.event);
    $(".weekname").html(localization.week);
    $(".monthname").html(localization.month);
    $(".yearname").html(localization.yearName);
    $(".exportCal").html(localization.exportCal);
    $(".exportmsg").html(localization.locExportMessage);
    $(".sunname").html(localization.sun);
    $(".monname").html(localization.mon);
    $(".tuename").html(localization.tue);
    $(".wedname").html(localization.wed);
    $(".thurname").html(localization.thur);
    $(".friname").html(localization.fri);
    $(".satname").html(localization.sat);
    $(".locShow").html(localization.locShow);
    $(".noschedule").html(localization.noschedule);
    $(".getMonthName").each(function(){var index = $(this).attr("mi"); $(this).html(localization.locFullMonthNames[index]);})
    $(".locTitle").html(localization.locTitle);
    $(".locDesc").html(localization.locDesc);
    $(".locDate").html(localization.locDate);
    $(".locFrom").html(localization.locFrom);
    $(".locUntil").html(localization.locUntil);
    $(".locLocation").html(localization.locLocation);
    $(".locOccurrence").html(localization.locOccurrence);
    $(".locOnce").html(localization.locOnce);
    $(".locEveryDay").html(localization.locEveryDay);
    $(".locEveryWeek").html(localization.locEveryWeek);
    $(".locEveryMonth").html(localization.locEveryMonth);
    $(".locEveryYear").html(localization.locEveryYear);
    $(".locDelete").html(localization.locDelete);
    $(".locSave").html(localization.locSave);
    $(".locNoComments").html(localization.locNoComments);
    $(".locComment").html(localization.locComment);
    $(".locSend").html(localization.locSend);


    var i =0;
    $(".locMonth").each(function(){
        $(this).html(localization.locFullMonthNames[i]);
        i++;
    });

    var i =0;
    $(".dayName").each(function(){
       $(this).html(localization.dayNames[i]);
        i++;
    });

    var i=0;
    $(".yearCalHeader").each(function(){
        $(this).html(localization.monthNames[i]);
        i++;
    })

}
