//
// Johan Coppieters - jan 2013 - De Essen
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");

var kOneDay = 24 * 60 * 60 * 1000;
var gDays = {0: "Maandag", 1: "Dinsdag", 2: "Woensdag", 3: "Donderdag", 4: "Vrijdag", 5: "Zaterdag", 6: "Zondag"};
var gMonths = {1: "Januari", 2: "Februari", 3: "Maart", 4: "April", 5: "Mei", 6:"Juni",
               7: "Juli", 8: "Augustus", 9: "September", 10: "Oktober", 11: "November", 12: "December"};



function BookingController(context) {
  console.log("BookingController.constructor -> page: ("
                + context.page.itemId + ") " + context.page.title);
  
  cody.Controller.call(this, context);
}
BookingController.prototype = Object.create( cody.Controller.prototype );
module.exports = BookingController;



BookingController.prototype.doRequest = function( finish ) {

  console.log("BookingController.doRequest -> request = " + this.getRequest());
  
  var aDate = this.getDate("date") || new Date();

  if (this.isRequest("")) {
    this.context.step = 0;
    this.step0( aDate, finish );
  
  } else if (this.isRequest("form")) {
    this.context.step = 1;
    this.step1( aDate, finish );
  
  } else if (this.isRequest("Bevestig")) {
    this.context.step = 2;
    this.step2( aDate, finish );
  }
};

BookingController.prototype.step2 = function( theDate, finish ) {
  var self = this;
  this.context.datename = getDateName(theDate);
	this.context.date = theDate;

	var aName = this.getParam("name");
	var aStatus = this.getParam("status", "");
  if (aStatus == "Nieuw")
			aName += " (nieuw)";

	var aSlot = this.getParam("slot", 0);

	self.query(
    "select id from apps where appoint = date(?) and slot = ? and name!='' ",
    [theDate, aSlot],
    function (err, results) {
      if (results.length > 0) {
        self.feedBack(false, "Onze excuses, iemand heeft ondertussen reeds dit tijdstip bij deze arts ingenomen, probeert U nog eens.");
        self.context.step = 99;
        finish();
        
      } else {
        self.query(
          "insert into apps (slot,appoint,type,name,what) values (?,?,'W',?,?)"
              + " on duplicate key update name = values(name), type='W', what=values(what)",
          [aSlot, theDate, aName, (self.getParam("what") + " (" + self.getParam("phone") + ", " + self.getParam("email") + ")")],
          function(err, results) {
            // get email from dr from slot
            self.query(
              "select email from users left join slots on slots.dr = users.id where slots.id = ?",
              [aSlot],
              function(err, results) {
                var drMail = (results.length < 1) ? "secretariaat@de-essen.be" : results[0].email;
                self.sendTheMails(drMail, self.getParam("drname", "Mevrouw"));
                finish();
            });
        });
      }
  });
};

BookingController.prototype.sendTheMails = function( dr, title ) {
  console.log("BookingController.sendTheMails -> to: " + dr + " - " + title);
};


BookingController.prototype.step1 = function( theDate, finish ) {
  var self = this;
  
	var aDr = self.getParam("dr");
  self.context.dayname = getDayName(self.getParam("daynr", 0));
  self.context.datename = getDateName(theDate);
  self.context.date = theDate;

  self.query("select id,name from users where id = ?", [aDr],
    function(err, results) {
      self.context.dr = results[0];
      finish();
    });
};

BookingController.prototype.step0 = function( theDate, finish ) {
  var self = this;
  console.log("BookingController.step0");
  
  theDate = makeMonday( theDate );
  self.context.date = theDate;
  self.context.prevDate = new Date(theDate.getTime() - 7 * kOneDay);
  self.context.nextDate = new Date(theDate.getTime() + 7 * kOneDay);

  var maxRows = 0;
  var cnt = 0;
  var dayNumber;

  // for use in query -> show free slots of today only if after current time
  var currHour = getCurrHHMM();
  var currDate = getToday();

  function doNext() {

    function fetchNextDay() {
      // console.log("BookingController.fetchNextDay -> " + dayNumber + " = " + theDate);
      
      if (theDate.getTime() < currDate.getTime()) {
        // don't show slots before today -> add empty list
        self.context.dayList.push([]);
        doNext();
      } else {
        // show free slots of today only if after current tim
        self.query(
          "select slots.hour, slots.id as slot, slots.dr, apps.type, slots.daynr, date(?) as xdate,"
              + " (select users.name from users where users.id = slots.dr) as drname "
              + "from slots left outer join apps "
              + " on slots.id = apps.slot and apps.appoint =  date(?) "
              + "where (apps.type = 'X' or (slots.type = 'W' and (apps.name = '' or apps.name is null))) "
              + " and slots.daynr = ? and (slots.hour > ? or date(?) != date(?))"
              + " order by slots.daynr, slots.hour, slots.dr ",
          [theDate,theDate,dayNumber,currHour,theDate, currDate],
          function(err, results) {
            self.context.dayList.push(results); 
            // collect the max nr of slots returned for any day
            if (results.length > maxRows) maxRows = results.length;
            doNext();
        });
      }
    }

    dayNumber++;
    if (dayNumber != 5) {
      // go for the next day
      theDate = new Date( theDate.getTime() + kOneDay );
      self.context.dayNames.push( makeNiceDate(theDate, dayNumber) );
      fetchNextDay();
      
    } else {
      // week is finisehd,
      //  do this 3 times if we haven't found free slots yet
      cnt++;
      if ((cnt < 3) && (maxRows == 0)) {
        // skip over the weekend, go immediatly to next monday
        theDate = new Date( theDate.getTime() +  3 * kOneDay );
        dayNumber = 0;

        // restart the week, clear the lists
        self.context.dayNames = [];
        self.context.dayList = [];
        
        fetchNextDay();
      } else {
        // we're finished, give control to our parent
        // console.log(self.context.dayList);
        self.context.maxRows = maxRows;
        
        finish();
      }
      
    }  
  }

  // init the variables and start chasing free slots
  self.context.dayNames = [];
  self.context.dayList = [];
  
  // set counters -1d, because doNext starts with a +1d
  dayNumber = -1;
  theDate = new Date(theDate.getTime() - kOneDay);
  doNext();
};




function makeMonday(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1);
}

function makeNiceDate(d, dayNr) {
  var datename = getDateName(d);
  datename = datename.substring(0, datename.length - 5);
  return (getDayName(dayNr) + " " + datename);
}

function getToday() {
  // now, but with the timepart = 0
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function Two(n) {
  return (n < 10) ? ("0" + n) : n;
}
function getCurrHHMM() {
  var d = new Date();
  return Two(d.getHours()) + ":" + Two(d.getMinutes());
}


function getDateName(theDate) {
  return theDate.getDate() + " " + getMonthName(theDate.getMonth()+1) + " " + theDate.getFullYear();
}


function getDayName(theNr) {
  return gDays[theNr];
}

function getMonthName(theMonth) {
  return gMonths[theMonth];
}

