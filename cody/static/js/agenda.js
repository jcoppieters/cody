function initAgenda() {
	$.datepicker.setDefaults({buttonImage: "", dateFormat: "yy-mm-dd", firstDay: 1, showWeek: false});

    $(".success").delay(8000).fadeOut(500);
    
	// submit page when date is changed
	$("#currDate").datepicker()
		.datepicker("setDate", $("#currDate").val())
		.change( changeDate );
	// set date in a readable form
	$("#bar h1").text( 
			$.datepicker.formatDate( "DD, d MM yy", $("#currDate").datepicker("getDate"))); 
	
	$("#bar #q").keyup( function (event) { 
		if (event.which == 13) { 
			document.location.href = gPrefix + "/nl/agenda?request=search&q=" + $(this).val()
		} 
	});
	$("#bar img").click( showCalendar );

	
	$("#patForm").hide();
	$("#todoForm").hide();
	
	// $(".drs td").click( showToDo );
	$(".drs img").click( addToDo );
	$(".todoListEdit").click( editToDo );
	
	$("#lijst td a img").click( toggleStatus );
	
	$("#dag .apps td").bind("click", showPatForm );
	$("#patForm #cancel").click( hidePatForm );
	$("#patForm #link").click( showPatDialog );
	
	if ($("#patDialog").length > 0) {
		$("#patDialog").dialog({ autoOpen: false, modal: true, width: 350, height: 400, 
								 title: "Patient zoeken", closeOnEscape: false,
								 beforeClose: function(event, ui) { $("#patDialog #patName").autocomplete("close"); } 
							   });
		$("#patDialog #do").click( doPatDialog );
		$("#patDialog #dont").click( dontPatDialog );
		$("#patDialog #del").click( delPatDialog );
		$("#patDialog #patName")
		  .autocomplete({ 
			source: gPrefix + "/nl/patients/search",
			select: function( event, ui ) {
						$("#patDialog #patId").val(ui.item.value);
						$("#patDialog #patName").val(ui.item.label);
						doPatDialog();
						return false;
					 }
		    })
		 .data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
			.appendTo( ul );
			};
		
		$("#todoForm #cancel").click( hideToDoForm );
	}
}

/***********************/
/* Patient search form */
/***********************/

function showPatDialog() {
	$("#patDialog #patId").val( $("#patForm #patient").val() );
	$("#patDialog #patName").val( $("#patForm #name").val() );
	$("#patDialog").dialog("open");
	$("#patDialog #patName").autocomplete("search");
}
function doPatDialog() {
	$("#patForm #patient").val( $("#patDialog #patId").val() );
	$("#patForm #name").val( $("#patDialog #patName").val() );
	dontPatDialog();
}
function delPatDialog() {
	$("#patForm #patient").val( "0" );
	dontPatDialog();
}
function dontPatDialog() {
	$("#patDialog").dialog("close");
}

function showCalendar() {
	// trick the datepicker in showing its picker... but keep the input field hidden
	$("#currDate").toggle().focus().toggle();
}

function changeDate() { 
	document.location.href = gPrefix + "/nl/agenda?date=" + $("#currDate").val();
}

/****************************/
/* ToDo / House call - form */
/****************************/

function editToDo() {	
	//showToDoForm( $("#dag #DR"+gCurrentDr) );
	showToDoForm($(this));
	
	$("#todoForm #todoId").val($(this).attr("data-id"));	
	$("#todoForm #todoDr").val($(this).attr("data-appointedto"));
	

	// set huisbezoek/todo/nota radio button
	$("#todoForm #todoTypeH").removeAttr("checked");
	$("#todoForm #todoTypeT").removeAttr("checked");
	$("#todoForm #todoTypeN").removeAttr("checked");
	var x = $(this).attr("data-type");
	if (x == 'B') x = 'H';
	$("#todoForm #todoType"+x).attr("checked", "true");
	
	$("#todoForm #todoName").val($(this).find(".todoListName").text());
	$("#todoForm #todoWhere").val($(this).find(".todoListWhere").text());
	$("#todoForm #todoWhat").val($(this).find(".todoListWhat").text());
	$("#todoForm #todoWhen").val($(this).find(".todoListWhen").text());
}

function addToDo() {
	var aTD = $(this).parent();
	showToDoForm( aTD );
}


function hideToDoForm() {
	$("#todoForm #todoId").val("");	
	$("#todoForm #todoDr").val("");
	
	$("#todoForm #todoNotAppointed").removeAttr("checked");
	
	$("#todoForm #todoTypeH").attr("checked", "true");
	$("#todoForm #todoTypeT").removeAttr("checked");
	
	$("#todoForm #todoName").val("");
	$("#todoForm #todoWhere").val("");
	$("#todoForm #todoWhat").val("");
	$("#todoForm #todoWhen").val("");
	
	var aForm = $("#todoForm");
	var aTD = aForm.parent();
	
	// move and hide form
	aForm.hide();
	$("#agenda").after(aForm);
		
	// reFillPat TD with old value and re-bind click handler
	gCurrentTTD = null;
	
	//aTD.click( showToDo );
	aTD.click( editToDo );
	$(aTD.find(".item")).show();
	
	gCurrentTTD = null;

	return false;
}

function showToDoForm( theTD ) {
	//set button Gedaan/Ongedaan
	if ($(theTD).attr("data-type") == "B" || $(theTD).attr("data-type") == "D") {
		$("#todoForm #done").val("Ongedaan");
	} else {
		$("#todoForm #done").val("Gedaan");
	}
	
	var aForm = $("#todoForm"); 
	
	if (gCurrentTTD != null) 
		hideToDoForm();

	// find and set the name of the Dr.
	var dr = theTD.find("#dokterNaam").text();
	aForm.find("#toDr").text( dr );
	
	// set drId
	var drId = theTD.find("#dokterId").text();
	aForm.find("#todoDr").val( drId );
	
	// move and show form
	theTD.append(aForm);
	aForm.show();
	
	// remember current edit-cell and its values
	gCurrentTTD = theTD;
	
	theTD.unbind();
	$(theTD.find(".item")).hide();
}

/********************/
/* Appointment form */
/********************/

function emptyTD( theTD ) {
	theTD.text("");
	theTD.removeClass();
}

function hidePatForm() { 
	var aForm = $("#patForm");
	var aTD = aForm.parent();
	
	// move and hide form
	aForm.hide();
	$("#agenda").after(aForm);
		
	// reFillPat TD with old value and re-bind click handler
	reFillPat(aTD);
	gCurrentTD = null;
	
	// prevent continuation of click chain (and as such showing the form again)
	return false;
}

function reFillPat(theTD) {
	theTD.html(gCurrentHTML);
	theTD.click(showPatForm);
}

function showPatForm() {
	// remember current values
	var aTD = $(this);
	var aTH = aTD.prev();
	
	var aHTML = aTD.html();
	var aText = aTD.find("span").text();
	var aData = aText.split("\|");
	var aName = aData[0].trim();
	var aWhat = "";
	if (aData.length > 1)
		aWhat = aData[1].trim();
	
	var aForm = $("#patForm");
	$("#patForm #name").val(aName);
	$("#patForm #what").val(aWhat);
	$("#patForm #id").val( aTD.attr("id") );
	$("#patForm #slot").val( aTH.attr("id") );	
	$("#patForm #patient").val( aTD.attr("abbr") );
	
	var aType = aTD.attr("class");
	$("#patForm #type").val( aType );
	if (aType != 'S' && aType != 'X') aType = 'A';
	$("#patForm input[name=kind][value="+aType+"]").attr("checked", true);
	
	// empty TD and remove click handler
	aTD.html("");
	aTD.unbind();
	
	// move and show form
	aTD.append(aForm);
	aForm.show();
	
	// restore values if we were editing another cell
	if (gCurrentTD != null)
		reFillPat(gCurrentTD);
	
	// remember current edit-cell and its values
	gCurrentTD = aTD;
	gCurrentHTML = aHTML;
}

/**********/
/* header */
/**********/

function toggleStatus() {
	var src = $(this).attr("src");
	if ( src.indexOf("notyet") == -1)
		$(this).attr("src", src.replace("checked","notyet"));
	else
		$(this).attr("src", src.replace("notyet","checked"));
}

function showToDo() {
	dr = $(this).attr("id").substring(2);

	if (gCurrentDr != null) {
		$("#dag #DR"+gCurrentDr).removeClass("active");
		$("#dag #DT"+gCurrentDr).hide();
	}
	
	if (gCurrentDr != dr) {
		$("#dag #DT"+dr).show();
		$("#dag #DR"+dr).addClass("active");
		gCurrentDr = dr;
	} else
		gCurrentDr = null;

}


// ToDo list
var gCurrentDr = null;

// Editing an appointment
var gCurrentTD = null;
var gCurrentHTML = "";
  
// Editing a ToDo
var gCurrentTTD = null;


$(document).ready( initAgenda );