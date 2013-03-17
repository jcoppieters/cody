//
// Johan Coppieters 
//   - mar 2011 - rWorks
//   - mar 2013 - jCMS
//
//
///////////////////////
// Editor functions  //
///////////////////////

$(document).ready(function() {
   $('#editContent').tinymce({
    external_image_list_url: gContext + "/" + gLanguage + "/sitemap/imagelist",
    script_url : gStatic + '/js/tinymce/tiny_mce.js',
    
    mode: "none",         // manually attach with mceAddControl/mceRemoveControl
    theme: "advanced",
    width: "998",
    height: "450",
    plugins: "safari,table,advhr,advimage,autosave,advlink,emotions,media,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking",
    content_css : gStatic + "/css/front.css",
  
    // Theme options
    theme_advanced_buttons1 : "cut,copy,paste,pastetext,pasteword,|,bold,italic,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,|,bullist,numlist,indent,outdent,|,forecolor,fontsizeselect",
    theme_advanced_buttons2 : "undo,redo,|,link,unlink,anchor,image,code,|,tablecontrols,|,hr,|,sub,sup,|,charmap",
    theme_advanced_buttons3 : "",
    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    //theme_advanced_statusbar_location : "bottom",
    //theme_advanced_resizing : true,
    theme_advanced_path : false
  });
});

function getPage(id) {
   HideEditor();
   gCurrentNode = id;
   
   $.ajax({
     type: "GET", url: gContext + "/" + gLanguage + "/sitemap",
     data: "request=getnode&node=" + id,
     success: function(msg){
       if (msg.substring(0,3) == "NOK") {
      	 WarnUser("Got error from server: " + msg);
              
       } else if (msg.substring(0,3) == "NAL") {
      	 	WarnUser("You are not allowed to edit this page, sorry.");
             
       } else {
           $("#right_cont").html(msg).show();
           
           // decode of data element
           $("editData").val( unescape($("#editData").val()) );
           $("#editDataLength").text(editData.value.length + " bytes");

           // add file selector
           // setup_fg();

          // make list sortable
          $("#files").sortable().disableSelection();

          // add date pickers
          $.datepicker.setDefaults({
            showOn: "both",
            buttonImage: gImages + "/icon_calendar.png",
            buttonImageOnly: true,
            dateFormat: "dd-mm-yy"});
          console.log($.datepicker);
        
          $(".dater").datepicker();
          
          // validate numbers
          $("#onepage").validate();
          
          $("#domains").change( function() {
              var g = $('#allowedgroups').val();
              if (g != "") {
              	$('#allowedgroups').val( g + ((g.length > 0) ? ',':'') + $('#domains').val() );
              }
          });
          
          $("#doDelete").click( function() {
            $("#request").val("realdelete");
            $("form#onepage").submit();
          });
          
          $("#doAdjust").click( function() {
            $("#request").val("adjust");
            $("form#onepage").submit();
          });
       }
     }
   });
}

function saveOrder() {
  var serialStr = $("#otherElements").val();
  $("#files li").each(function() { serialStr += (serialStr != ""  ? "," : "") + $(this).attr("id"); });
  $("#elements").val(serialStr);
};


function SaveEditor() {
  HideEditor();
  $.ajax({
         type: "POST", url: "./sitemap",
         data: "oper=savedata&node="+gCurrentNode+"&data=" + escape(document.getElementById("editContent").value),
         success: function(msg){
            if (msg.substring(0,2) != "OK") {
                alert("Data not saved!\nGot error from server: " + msg);
                // rollback data from our form
                document.getElementById("editContent").value = document.getElementById("editData").value;
             } else
                // replace data in our form
              var editData = document.getElementById("editData");
             editData.value = document.getElementById("editContent").value;    
           document.getElementById("editDataLength").innerHTML = editData.value.length + " bytes";
         }
       })
}


function HideEditor(theDiv) {
   $('#editContent').tinymce().hide();
}
function ShowEditor(theDiv) {
  $("#editContent").html( $("#editData").html() );
  $("#editContent").tinymce().show();
}

function HideFileEditor() {
  $("#FileEditor").hide();
}
function ShowFileEditor(nr) {
  // try to move the editor just in front of the element
  // didn't succeed, so there's some error in the code below.
  //parent = $('#N'+nr).parent();
  //x = $('#FileEditor').clone();
  //$('#FileEditor').remove();
  //parent.insertAfter( x );
  
  $('#FileEditor').show();
  $('#currentElement').val(nr);
  $('#filename').val( $('#N'+nr).val() );
  $('#fileurl').text( $('#S'+nr).val() );
}
function SaveFileEditor() {
  var nr = $('#currentElement').val();
  var fn = $('#filename').val();
  var url = $('#fileurl').text();

  if (url != '') {
    $('#S'+nr).val( url );
    $('#A'+nr).attr("href", gContext + "/data/files/" + url );
    
    parts = url.split('.');
    $('#I'+nr).attr("src", gContext + "/images/extentions/" + parts[1] + ".gif" );
  }
  $('#N'+nr).val( fn );
  $('#F'+nr).text( fn );
  
  $('#FileEditor').hide();
  // console.log(('#N'+nr) + " <= " + fn + " - " + url + " - " + parts[1]);
}

function AddFileDiv(filenr, elementid, filename, img, url) {
  if ($('#files').size() == 0) {
    $('#page').append('<div><label>Files</label><ul id="files"></ul></div>');
  }
  $('#files').append('<li id="' + elementid + '">\
    <div class="File"><label><img class="handle" src="<%=images}/move.png" /> File '+filenr+'</label> \
    <span id="F' + elementid + '">'+filename+'</span>\
    <input name="K' + elementid + '" id="K' + elementid + '" type="hidden" value="F" /> \
    <input name="N' + elementid + '" id="N' + elementid + '" type="hidden" value="" /> \
    <input name="S' + elementid + '" id="S' + elementid + '" type="hidden" value="'+filename+'" /> \
    <a href="'+url+'" target=_blank id="A' + elementid + '"><img id="I' + elementid + '" src="'+img+'" border=0 /></a> \
    <a href="#" onclick="ShowFileEditor('+elementid+');">Edit</a> | \
    <a href="#" onclick="DeleteFile('+elementid+');">Delete</a> <br />\
   </div></li>');
}

function AddFile(nr) {
  var nr = $('#nrElements').val() * 1 + 1;
  $('#nrElements').val(nr);
  
  var xnr = 900 + nr;
  var currValues = $('#elements').val();
  $('#elements').val( (currValues != "") ? currValues+","+xnr : xnr );

  AddFileDiv(nr, xnr, '&lt;no file&gt;', gImages + '/extentions/xxx.gif', '#');
  
  ShowFileEditor(xnr);
}

function DeleteFile(nr) {
  $('#F'+nr).parent().hide();
  $('#K'+nr).val('X');
}


function setup_fg(){

  $.get(gContext + gLanguage + '/files', 'request=select&type=I', 
      function(data) { 
        $('#fileSelector').menu({ content: data, backLink: false, showSpeed: 300, height: 180, crumbDefaultText: 'Change:' }); 
      }
  );
}
