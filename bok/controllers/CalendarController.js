console.log("loading " + module.id );

var mysql = require("mysql");
var cody =  require("../../cody/index.js");
var fs = require("fs");

//sql statements
CalendarController.sqlGetAllAppointments = "select * from appointment";
CalendarController.sqlGetAppointmentById = "select * from appointment where idappointment = ?";
CalendarController.sqlGetAppointmentsForDay = "select * from appointment where date = ?";
CalendarController.sqlGetAppointmentsForRange = "select *, (select count(*) from appointmentcomment where appointmentId = ap.idappointment) as commentcount from appointment ap left join users on users.id = ap.userId where date(`date`) >= date(?) and date(`date`) <= date(?) order by date";
CalendarController.sqlGetFutureAppointments = "select * from appointment where date(`date`) >= date(now()) order by date limit ?";
CalendarController.sqlInserNewAppointment = "insert into appointment(title, description, `date`, start, end, location, userId) values(?, ?, ?, ?, ?, ?, ?)";
CalendarController.sqlInsertWithoutValues = "insert into appointment(title, description, `date`, start, end, location, userId) values";
CalendarController.sqlInsertOnlyValues = "(?, ?, ?, ?, ?, ?, ?)";
CalendarController.sqlDeleteAppointment =  "delete from appointment where idappointment = ?";
CalendarController.sqlUpdateAppointment = "update appointment set title = ?, description = ?, `date` = ?, start = ?, end = ?, location = ? where idappointment = ?" ;

CalendarController.sqlGetCommentsForAppointment = "select * from appointmentcomment ap join users u on u.id = ap.userId where ap.appointmentId = ? order by time";
CalendarController.sqlSubmitComment = "insert into appointmentcomment(appointmentId, userId, time, comment) values(?, ?, ?, ?)";
CalendarController.sqlDeleteComment = "delete from appointmentcomment where idappointmentComment = ?";

function CalendarController(context) {
    this.monthView = "../views/calendar-month.ejs";
    this.weekView = "../views/calendar-week.ejs";
    this.yearView = "../views/calendar-year.ejs";
    this.ExportView = "../views/exportview.ejs";
    this.DetailView = "../views/detail.ejs";
    this.listview = "../views/appointmentlist.ejs";
    this.ICSView = "../views/calendar-ics.ejs";


    // init inherited controller
    cody.Controller.call(this, context);
    this.context.Controller = this;
}

CalendarController.prototype =  Object.create( cody.Controller.prototype );
module.exports = CalendarController;


CalendarController.prototype.doRequest = function(finish) {
    var self = this;

    // check if this page requires calendar content
    for (var iC in self.context.page.content) {
        var C = self.context.page.content[iC];
        if (C.kind === "C") {
            self.doListFuture(C.data, function() {
                self.regularRequest(finish);
            });
            return;
        }
    }
    // no specific content, just regular CalendarRequest
    //  if no request/view specified, default to monthview
    if (self.isRequest("") || self.isRequest("list")) { self.setRequest("monthview"); }
    self.regularRequest(finish);
}

CalendarController.prototype.regularRequest = function(finish) {
    var self =  this;

    var date = new Date();

    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();
    var pagename = self.getParam("pagename");


    if (self.isRequest("monthview")) {
        self.doCal(currentMonth, currentYear, function() {finish(self.monthView)});

    } else if (self.isRequest("add")) {
        var title = self.getParam("title");
        title = (title === "") ? "--" : title;

        var description =  self.getParam("description");
        //var date = self.getParam("date");  //this will get the date as a string
        var date = self.getDate("date",new Date()); // this will get the date as an easy to use object
        var start = self.getParam("start");
        var end = self.getParam("end");
        var location = self.getParam("location");
        var occurrence = self.getParam("occurrence");
        var userId = self.context.login.getId();

        self.addNewAppointment(title, description, date, start, end, location, userId, occurrence, function() {
            self.gotoCorrectView(pagename, date, finish);
        });

    } else if (self.isRequest("otherMonth")) {
        var month = parseInt(self.getParam("month"), 10);
        var year = self.getParam("year");
        self.doCal(month, year, function() {
            finish(self.monthView);
        });

    } else if (self.isRequest("delete")) {
        var toDelete = self.getParam("id");
        self.query(CalendarController.sqlDeleteAppointment, [toDelete], function(err, res) {
            if (err) {
                console.log(err);
                self.feedBack(false, "something went wrong");
            }
            self.gotoCorrectView(pagename, date, finish);
        });

    } else if (self.isRequest("commentAppointment")) {
        var id = self.getParam("apId") ;
        var comment =  self.getParam("comment");
        var userId = self.context.login.getId();
        var time = self.getCurrentDateTime();
        self.query(CalendarController.sqlSubmitComment, [id, userId, time, comment], function(err, res) {
            if (err) {console.log(err);}
            self.context.invoke = id;
            //self.doCal(currentMonth, currentYear, function() {finish(self.monthView)});
            self.gotoCorrectView(pagename, date, finish);
        });

    } else if (self.isRequest("weekview")) {
        var now = new Date();
        self.doWeekView(now, function() {
            finish(self.weekView);
        });

    } else if (self.isRequest("otherweek")) {
        var now = new Date(self.getParam("time"));
        if (self.getParam("action") === "next") {
            now.setDate(now.getDate() +7);
        } else if (self.getParam("action") === "prev") {
            now.setDate(now.getDate() -7);
        }
        self.doWeekView(now, function() {
            finish(self.weekView)
        });

    } else if (self.isRequest("yearview")) {
        var year = new Date().getFullYear();
        self.doYearView(year, function() {
            finish(self.yearView);
        });

    } else if (self.isRequest("ics")) {
        var year = new Date().getFullYear();
        self.doICS(function() {
            finish(self.ICSView);
        });

    } else if (self.isRequest("otheryear")) {
        var year = self.getParam("year");
        self.doYearView(year, function() {finish(self.yearView);});

    } else if (self.isRequest("futureappointments")) {
        var count = self.getParam("count", 10);
        self.doListFuture(count, function() {finish(self.listview);});


    } else if (self.isRequest("edit")) {
        var id = self.getParam("id");
        var title = self.getParam("title");
        var date = self.getDate("date",new Date());
        var from = self.getParam("start");
        var to = self.getParam("end");
        var location = self.getParam("location");
        var description = self.getParam("description");       //title, description, date, start, end, location, id
        self.query(CalendarController.sqlUpdateAppointment, [title, description, date, from, to, location, id], function(err, res) {
            if (err) {console.log(err);}
            //self.context.invoke = id;
            self.gotoCorrectView(pagename, date, finish);
            //self.doCal(currentMonth, currentYear, function() {finish(self.monthView)});
        });

    } else if (self.isRequest("deleteComment")) {
        var apId = self.getParam("apId");
        var comId = self.getParam("idToDelete");
        self.query(CalendarController.sqlDeleteComment, [comId], function(err, res) {
            self.context.invoke = apId;
            //self.doCal(currentMonth, currentYear, function() {finish(self.monthView)});
            self.gotoCorrectView(pagename, date, finish);
        });

    } else if (self.isRequest("ajaxDetail")) {
        self.context.createFromDate = false;
        var apId = self.getParam("id");
        self.context.pagename = pagename;
        console.log("ajaxdetail is called, the value of pagename = " + self.context.pagename);
        if (apId !== undefined) {
            self.context.view = true;
            self.doViewAppointment(apId, function() {finish(self.DetailView);});
        } else {
            self.context.appointment = new Object();
            self.context.view = false;
            finish(self.DetailView);
        }

    } else if(self.isRequest("createFromDate")){
        self.context.date = new Date(self.getParam("date"));
        self.context.view = false;
        self.context.createFromDate = true;
        self.context.appointment = new Object();
        self.context.pagename = pagename;
        finish(self.DetailView);
    } else {
        cody.Controller.prototype.doRequest.call(self, finish);

    }
}

CalendarController.prototype.render = function(theContent) {
    var html = "<table><caption>Upcoming</caption>";

    for (var iA in this.context.appointments) {
        var A = this.context.appointments[iA];
        html += "<tr><th>" + this.context.formatDate(A.date) + "</th><td>" + A.title + "</td></tr>" +
            "<tr><td colspan=2 class='description'>" + A.description + "</td></tr>";
    }
    return html + "</table>";
}


CalendarController.prototype.doListFuture = function(count, finish) {
    var self = this;
    count = this.makeInt(count, 10);
    self.query(CalendarController.sqlGetFutureAppointments, [count], function(err, res) {
        if (err) {console.log(err)}
        self.context.appointments = res;
        finish();
    });
}

CalendarController.prototype.doYearView = function(year, finish) {
    var self = this;

    self.context.pagename ="year";
    var startDay = new Date(year + "-1-1");
    var endDay = new Date(year + "-12-31");
    self.context.year = year;
    self.context.daysInMonth = getDaysInMonthForYear(year);

    console.log("looking for appointments between " + startDay + " and " + endDay);
    self.query(CalendarController.sqlGetAppointmentsForRange, [startDay, endDay], function(err, res) {
        if (err) {console.log(err)}
        var curDate = startDay;
        var months = [];
        for(var m = 0; m < 12; m++) {
            var month = [];
            curDate.setMonth(m);
            for(var d = 0; d < daysInMonth(year, curDate.getMonth());d++) {
                curDate.setDate((d+1));
                var day = [];
                for(var i=0; i < res.length; i++) {
                    curRes = res[i];
                    if (curRes.date.toDateString() === curDate.toDateString()) {
                        day.push(curRes);
                        res.splice(i, 1); //remove from resultset increases search speed
                    }
                }
                month[d] = day;
            }
            months[m] = month;
        }
        self.context.months = months;
        finish();
    });
}
function getDaysInMonthForYear(year) {
    var toReturn = [];
    for(var i = 0; i < 12; i++) {
        toReturn[i] = daysInMonth(i, year);
    }
    return toReturn;
}

CalendarController.prototype.doICS = function(finish) {
    var self = this;

    self.context.events = [];

    self.context.res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    self.context.res.setHeader("Content-Disposition", "inline; filename=calendar.ics");

    self.query(CalendarController.sqlGetAllAppointments, [], function(err, res) {
        if (err) {console.log(err);}
        for(var i = 0; i < res.length; i++) {
            var date = new Date();
            var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            self.context.events[i] = {
                title: res[i].title,
                start: getDateTimeString(res[i].date, res[i].start),
                end: getDateTimeString(res[i].date, res[i].end),
                timestamp: getDateTimeString(date, time),
                id: res[i].idappointment,
                description: res[i].description,
                location: res[i].location,
                status: "CONFIRMED"
            };
        }

        finish();
    });
}


CalendarController.prototype.doViewAppointment = function(id, finish) {
    var self = this;
    self.query(CalendarController.sqlGetAppointmentById, [id], function(err, res) {
        if (err) {console.log(err);}
        self.context.appointment = res[0];
        self.query(CalendarController.sqlGetCommentsForAppointment, [id], function(err, res) {
            if (err) {console.log(err);}
            self.context.comments = res;
            finish();
        });
    });
}

CalendarController.prototype.doCal =  function(month, year, finish) {
    var self = this;

    var thisMonth = new Date(year, month, 1);
    self.context.startIndex = thisMonth.getDay();
    self.context.endIndex = self.context.startIndex + (daysInMonth(month, year)-1);
    self.context.daysInLastMonth = daysInMonth((month -1), year);
    self.context.daysInThisMonth = (daysInMonth(month, year));
    self.context.currentMonth = month %12;
    self.context.currentYear = year;
    self.context.pagename ="month";
    var sqlMonth = (month +1);


    //construct start- and end date
    var startDate = "";

    if (self.context.startIndex > 0) {
        var curYear = month === 0 ? (year - 1): year;
        var prevMonth = month === 0 ? 11 : month -1;
        var startDay = daysInMonth(prevMonth, curYear) - self.context.startIndex;
        startDate = new Date(curYear, prevMonth, startDay);
    }else {
        startDate = new Date(year, thisMonth.getMonth(), 1);
    }

    var endDate = "";
    if (self.context.endIndex < 34) {
        var curYear = sqlMonth === 12 ? (parseInt(year, 10) +1): year;
        var nextMonth = sqlMonth <12 ? (sqlMonth) : 1;
        var endDay = 35 - self.context.endIndex;
        endDate = new Date(curYear, nextMonth, endDay);
    }else {
        endDate = new Date(year, sqlMonth, daysInMonth(month, year));
    }
    console.log("looking for appointments between: " + startDate + " and " + endDate);
    self.query(CalendarController.sqlGetAppointmentsForRange, [startDate, endDate], function(err, res) {
      console.log(res);
        self.context.days = [];
        if (err) {
            console.log(err);
            self.feedBack(false, "Something went wrong, please try again");
            finish();
        }else {
            self.context.appointments = copyArray(res); //use a copy of the resultset to build the dialogs
            //format result to an array of 35 elements (one for each day)
            var days = [];
            for(var i = 0; i < 35; i++) {
                days[i] = [];
                //construct date
                if (i < self.context.startIndex) {
                    if (sqlMonth === 1) {
                        curYear = year -1;
                        curMonth = 12;
                    }else {
                        curYear = year;
                        curMonth = sqlMonth -1;
                    }
                    curDay = daysInMonth(curMonth, curYear) - (self.context.startIndex -1) + i;
                } else if (i > self.context.endIndex) {
                    if ((sqlMonth) === 12) {
                        curMonth = 1; curYear = (parseInt(year, 10) +1);
                    } else {
                        curMonth = sqlMonth +1;
                    }
                    curDay = i - self.context.endIndex;
                }else {
                    //this month
                    curMonth = sqlMonth;
                    curYear = year;
                    curDay = 1 + (i - self.context.startIndex);
                }
                curMonth = curMonth < 10 ? "0" + curMonth: curMonth;
                curDay = curDay < 10 ? "0"+ curDay : curDay;
                var curDate = new Date(curYear + "-" + curMonth + "-" + curDay);

                //find the appointments for this day in the result and push it into days[i]
                for(var resI = 0; resI < res.length; resI ++) {
                    if (curDate.toDateString() === res[resI].date.toDateString()) {
                        days[i].push(res[resI]);
                        res.splice(resI, 1);   //remove from resultste, increases search speed
                    }
                }
            }
            self.context.days = days;
            finish();
        }
    });
}

function daysInMonth(month, year) {
    return new Date(year, (month+1), 0).getDate();
}

CalendarController.prototype.getAppointmentsForDay = function(param, callback) {
    var self = this;
    self.query(CalendarController.sqlGetAppointmentsForDay, param, function(err, res) {
        if (!err) {
            callback(res);
        }else {
            console.log(err);
        }
    });
}

CalendarController.prototype.doWeekView = function(now, finish) {
    var self = this;
    self.context.pagename ="week";
    var sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    console.log("sunday: " + sunday.toDateString());
    var dates = []
    for(var i =0; i < 7; i++)
    {
        var date = new Date(sunday);
        date.setDate(date.getDate() + i);
        console.log(date.toDateString());
        dates.push(date);
    }
    self.context.dates = dates;

    var days = [];
    console.log("looking for appointments between: " + dates[0] + " and " + dates[6]);
    self.query(CalendarController.sqlGetAppointmentsForRange, [dates[0], dates[6]], function(err, res) {
        if (err) {console.log(err);}
        console.log("Found " + res.length +" appointment(s)!");
        for(var d =0; d < dates.length; d++) {
            days[d] = [];
            for(var i = 0; i < res.length; i++) {
                if (res[i].date.toDateString() === dates[d].toDateString()) {
                    days[d].push(res[i]);
                }
            }
        }
        self.context.days = days;
        finish();
    });
}

function copyArray(toCopy) {
    var toReturn = new Array();
    for(var i = 0; i < toCopy.length; i++) { console.log(i + " - " + toCopy[i]);
        toReturn[i] = toCopy[i];
    }
    return toReturn;
}

function getDateTimeString(date, time) {
    var toFormat = new Date(date);
    var toReturn = "";
    toReturn += toFormat.getFullYear();
    var month = (toFormat.getMonth() +1) < 10 ? "0" + (toFormat.getMonth() +1) : (toFormat.getMonth() +1);
    toReturn += month;
    var day = toFormat.getDate() < 10 ? "0" +  toFormat.getDate() :  toFormat.getDate();
    toReturn += day;
    var t = time.replace(":", "");
    t = t.replace(":", "");
    toReturn += "T" + t+"00";
    return toReturn;
}


CalendarController.prototype.getCurrentDateTime = function() {
    var date = new Date();
    var curdateTime = "";
    curdateTime += date.getFullYear() + "-" + (date.getMonth() +1)+ "-" + date.getDate();
    curdateTime += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return curdateTime;
}

//TODO refactor (code duplication)
CalendarController.prototype.addNewAppointment = function(title, description, date, start, end, location, userId, occurrence, finish) {
    var self = this;
    //values of occurrence: 0 once, 1 every day, 2 every week, 3 every month, 4 every year
    var once = 0; var everyDay = 1; var everyWeek = 2; var everyMonth = 3; var everyYear = 4;
    var sql = CalendarController.sqlInsertWithoutValues;
    var param = [];
    var date = new Date(date);
    //generate sql statements by the value of occurrence
    switch(parseInt(occurrence, 10)) {
        case once:
            sql = CalendarController.sqlInserNewAppointment;
            param.push(title); param.push(description); param.push(date); param.push(start); param.push(end); param.push(location); param.push(userId);
            break;
        case everyDay:

            for(var i = 0; i < 365; i++) {
                //generate new date
                var newDate = new Date(date);
                newDate.setDate(date.getDate() + i);
                var dateString = newDate.getFullYear() + "-" + (newDate.getMonth() +1) + "-" + newDate.getDate();
                sql += i < 364 ?CalendarController.sqlInsertOnlyValues + ", ": CalendarController.sqlInsertOnlyValues ;
                sql += "\r\n";
                param.push(title); param.push(description); param.push(dateString); param.push(start); param.push(end); param.push(location); param.push(userId);
            }
            break;
        case everyWeek:
            for(var i = 0; i < 52; i++) {
                var newDate = new Date(date);
                newDate.setDate(date.getDate() + (i *7));
                var dateString = newDate.getFullYear() + "-" + (newDate.getMonth() +1) + "-" + newDate.getDate();
                sql += i < 51 ?CalendarController.sqlInsertOnlyValues + ", ": CalendarController.sqlInsertOnlyValues ;
                sql += "\r\n";
                param.push(title); param.push(description); param.push(dateString); param.push(start); param.push(end); param.push(location); param.push(userId);
            }
            break;
        case everyMonth:
            for(var i = 0; i < 12; i++) {
                var newDate = new Date(date);
                newDate.setMonth(date.getMonth() + i);
                var dateString = newDate.getFullYear() + "-" + (newDate.getMonth() +1) + "-" + newDate.getDate();
                sql += i < 11 ?CalendarController.sqlInsertOnlyValues + ", ": CalendarController.sqlInsertOnlyValues ;
                sql += "\r\n";
                param.push(title); param.push(description); param.push(dateString); param.push(start); param.push(end); param.push(location); param.push(userId);
            }
            break;
        case everyYear:
            for(var i = 0; i < 50; i++) {
                var newDate = new Date(date);
                newDate.setYear(date.getFullYear()  + i);
                var dateString = newDate.getFullYear() + "-" + (newDate.getMonth() +1) + "-" + newDate.getDate();
                sql += i < 49 ?CalendarController.sqlInsertOnlyValues + ", ": CalendarController.sqlInsertOnlyValues ;
                sql += "\r\n";
                param.push(title); param.push(description); param.push(dateString); param.push(start); param.push(end); param.push(location); param.push(userId);
            }
            break;
    }
    //execute the sql statement
    self.query(sql, param, function(err, res) {
        if (err) {console.log(err);}
        finish();
    })
}

CalendarController.prototype.gotoCorrectView = function(pagename, date, finish) {
    var self = this;
    var date = new Date(date);
    switch (pagename) {
        case "week": self.doWeekView(date, function() {finish(self.weekView);});
            break;
        case "month": self.doCal(date.getMonth(), date.getFullYear(), function() {finish(self.monthView);});
            break;
        case "year": self.doYearView(date.getFullYear(), function() {finish(self.yearView)});
            break;
    }

}


