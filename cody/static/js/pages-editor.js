//
// Johan Coppieters 
//   - mar 2011 - rWorks
//   - mar 2013 - cody
//
//
///////////////////////
// Editor functions  //
///////////////////////
var gCurrentBlock = "";

$(document).ready(function() {
  
  $("#doSaveEditor").button({ icons: { primary: "ui-icon-check"}, text: true}).click(doSaveEditor);
  $("#doCancelEditor").button({ icons: { primary: "ui-icon-close"}, text: true}).click(doCancelEditor);

  $("#block_selector").dialog({autoOpen: false, width: 240});
  $("#block_selector a.makeChoice").click( selectedContent );

  $("#template_selector").dialog({autoOpen: false, width: 340});
  $("#template_selector a.makeChoice").click( selectedTemplate );

  
  $('#editContent').tinymce({
    external_image_list_url: "/" + gLanguage + "/images?request=imagelist",
    script_url : gCody + '/js/tinymce/tiny_mce.js',
    
    mode: "none",         // manually attach with mceAddControl/mceRemoveControl
    theme: "advanced",
    width: "998",
    height: "450",
    plugins: "safari,table,advhr,advimage,advlink,emotions,media,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking",
    content_css : "/static/css/front.css",
  
    // Theme options
    theme_advanced_buttons1 : "cut,copy,paste,pastetext,pasteword,|,bold,italic,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,|,bullist,numlist,indent,outdent,|,forecolor,fontsizeselect",
    theme_advanced_buttons2 : "undo,redo,|,link,unlink,anchor,image,code,|,tablecontrols,|,hr,|,sub,sup,|,charmap",
    theme_advanced_buttons3 : "",
    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    //theme_advanced_statusbar_location : "bottom",
    //theme_advanced_resizing : true,
    theme_advanced_path : false,
    autosave_ask_before_unload: false
  });

});

function addPage() {
  var t = $("#tree").jstree("get_selected");
  if (t) {
    // ask the kind (text, form, image, file)
    $("#template_selector").dialog("open");
  } else {
    this.warnUser("Please select an item first");
  }
  return false;
}

function selectedTemplate() {
  $("#template_selector").dialog("close");
  gTree.nextType = $(this).attr("rel");
  var t = $("#tree").jstree("get_selected");
  if (t) {
    var ctype = {};
    if ($("#template_selector input[name=showcontent]:checked").val() === "Y") {
      ctype = { attr: { rel : "html" } };
    }
    $("#tree").jstree("create", t, "inside", ctype);
  }
}


function getPage(id) {
  var self = this;
  
  hideEditor();
   
  $.ajax({
     type: "GET", 
     url: "/" + gLanguage + "/pages",
     data: "request=getnode&node=" + id,
     success: function(msg){
       if (msg.substring(0,3) === "NOK") {
         self.warnUser("Got error from server: " + msg);
              
       } else if (msg.substring(0,3) === "NAL") {
         self.warnUser("You are not allowed to edit this page, sorry.");
             
       } else {

         $("#right_cont").html(msg).show();

         self.initNode(id);
      }
   }
 });
}


function initPage(id) {
  var self = this;

  self.currentNode = id;
  self.openNode = id;
  $("#newContentForm #node").val(id);

  $("#tabs").tabs().removeClass("ui-widget-content").removeClass("ui-corner-all");
  $("#tabs ul").removeClass("ui-widget-header");

  $("#right_cont #doView").button({ icons: { primary: "ui-icon-link"}, text: true}).click( doView );
  $("#right_cont #doSave").button({ icons: { primary: "ui-icon-check"}, text: true}).click( function() { saveOrder(); self.doSave(); return false; });
  $("#right_cont #doDelete").button({ icons: { primary: "ui-icon-trash"}, text: true}).click( function() { self.doRealDelete(); return false; });

  $("#right_cont #doAdjust").button({ icons: { primary: "ui-icon-close"}, text: true}).click( doAdjust );
  $("#right_cont #doAddContent").button({ icons: { primary: "ui-icon-plus"}, text: true}).click( doAddContent );

  $("#right_cont .doEditorT").button({ icons: { primary: "ui-icon-pencil"}, text: true}).click( doEditorT );
  $("#right_cont .doEditorI").button({ icons: { primary: "ui-icon-pencil"}, text: true}).click( doEditorI );
  $("#right_cont .doEditorF").button({ icons: { primary: "ui-icon-pencil"}, text: true}).click( doEditorF );
  $("#right_cont .doDeletor").button({ icons: { primary: "ui-icon-trash"}, text: true}).click( doDeletor );


  // Content //
  // make list sortable
  $("#content > div").sortable().disableSelection(); // sortable({items: "article"}) but we doesn't work UI-wise good


  // add date pickers
  $.datepicker.setDefaults({
    showOn: "both",
    buttonImage: gCody + "/images/icon_calendar.png",
    buttonImageOnly: true,
    dateFormat: "dd-mm-yy"});

  $(".dater").datepicker();

  // validate numbers
  $("#onepage").validate();

  $("#domains").change( function() {
    var g = $('#alloweddomains').val();
    if (g !== "") {
      $('#alloweddomains').val( g + ((g.length > 0) ? ',':'') + $('#domains').val() );
    }
  });

  // put short text into the P's of the text-data content blocks
  $("input.textdata").each(function() {
    var name = $(this).attr("name");
    var txt = $($(this).val()).text();
    $("#content_data #"+name).html(txt.substring(0,80) + " ...");
  });

}

function doView() {
  window.open( "/" + $("#language").val() + "/" + $("#node").val(), "_blank");
  return false;
}

function doDeletor() {
  var article = $(this).parent().parent();
  var theId = article.attr("id");
  
  $.ajax({
    type: "POST", url: "./pages",
    data: "request=deletecontent&node="+$("#node").val()+"&id=" + theId,
    success: function(msg){
       if (msg.status != "OK") {
         alert("Data not saved!\nGot error from server: " + msg.status + ", see console.");
         console.log(msg);
       } else {
         // remove the block from our page
         article.remove();
       }
     }
  });
  return false;
}

function doAdjust() {
  var node = $("#node").val();

  $.ajax({
    type: "POST", url: "./pages",
    data: "request=adjust&node="+node,
    success: function(msg){
      if (msg.status !== "OK") {
        alert("Data not adjusted!\nGot error from server: " + msg.status + ", see console.");
        console.log(msg);
      } else {
        gTree.getNode(node);
      }
    }
  });
  return false;

}


function doAddContent() {
  $("#block_selector").dialog("open");
  // ask the kind (text, form, image, file)  
  return false;
}
function selectedContent() {
  $("#block_selector").dialog("close");

  var kind = $(this).attr("rel");
  $("#kind").val(kind);

  $("#request").val("SaveX");
  $("#onepage").submit();

  return false;

  /*
   // Code below lost the content of previously created items
   //  code above is much slower and not needed
   //ex-TO DO: try to save entered content first !
  var node = $("#node").val();


  $.ajax({
  / type: "POST", url: "./pages",
    data: "request=addcontent&node="+node+"&kind=" + kind,
    success: function(msg){
       if (msg.status !== "OK") {
         alert("Data not saved!\nGot error from server: " + msg.status + ", see console.");
         console.log(msg);
       } else {
         //if the user entered data, it will be lost... !!
         gTree.getNode(node);
       }
     }
  });
  return false;
  */
}


function doAtomEditor(button, type, feedback) {
  $.ajax({
    type: "GET", 
    url: "/" + gLanguage + "/" + type,
    data: "request=menu",
    success: function(msg){
      if (msg.indexOf("<") < 0) {
        alert("Sorry, no items in your library yet.");
      }
      // find the block (<article>) that we are editing
      var article = button.parent().parent();
      var span = article.find("div.inputE > span");
      var img = article.find("div.inputE > img");
      
      // create the UL as DOM element and add it after the image's name
      var list = $(msg);
      span.after(list);
      
      // hide the image and its name
      span.hide();
      img.hide();
      
      // hide the button
      button.hide();
      
      // attach a menu to the UL
      var menu = list.menu();
      menu.on("menuselect", function(event, ui){ 
        var li = $(ui.item);
        
        // change the IMG, SPAN and others within the ARTICLE with all data found in the LI
        feedback(article, img, span, li);
        
        // no need for menu.menu("destroy"); as we remove the complete list
        list.remove();
        
        // show name, image and button again
        span.show();
        img.show();
        button.show();
      });
    }
  });
}

function doEditorI() { console.log("doEditorI");
  doAtomEditor($(this), "images", function(article, img, span, li) {
      // set image, name and (hidden) atom value
      img.attr("src", gDynamic + "/images/" + li.attr("rel"));
      span.text(li.attr("title"));
      article.find(".atom").val(li.attr("id"));
  });        
  return false;
}

function doEditorF() {
  doAtomEditor($(this), "files", function(article, img, span, li) {
    // set image, name and (hidden) atom value
    var fn = li.attr("rel");
    img.attr("src", gCody + "/extentions/" + fn.substring(fn.lastIndexOf(".")+1) + ".png");
    span.text(li.attr("title"));
    article.find(".atom").val(li.attr("id"));
  });
  return false;
}


function doEditorT() {
  var block = $(this).parent().parent();
  gCurrentBlock = block.attr("id");
  
  var kind = block.find(".kind").val();
  var data = block.find(".textdata").val();
  showEditor(data);
  return false;
}
function doSaveEditor() {
  saveEditor(gCurrentBlock);
}
function doCancelEditor() {
  hideEditor();
}

function hideEditor() {
  // rich text editor
  $("#editContent").tinymce().hide();
  
  // pane with save - cancel buttons.
  $("#content_div").hide();
}
function showEditor( content ) {
  // pane with save - cancel buttons.
  $("#content_div").show();
  
  // rich text editor
  $("#editContent").tinymce().show();
  $("#editContent").html(content);
}
function saveEditor(theId) {
  hideEditor();
  var content = $("#editContent").html();
  var block = $("#content_data #"+theId);
  
  // do we need to save it to the server?
  // on "save" all content is transmitted again...
  // perhaps just calling next 3 lines is enough:

  var name = block.find(".textdata").val( content ).attr("name");
  $("#content_data #"+name).html($(content).text().substring(0,80) + " ...");
  return true;


  /* "old" save immediate,
     not needed anymore, everything is saved if the user clicks the "Save" button.

  $.ajax({
     type: "POST", url: "./pages",
     data: "request=savecontent&node="+gTree.getCurrentNode()+
             "&id=" + theId +
             "&item=" + $("#node").val() +
             "&language=" + $("#language").val() +
             "&name=" + block.find(".name").val() +
             "&sortorder=" + block.find(".sortorder").val() +
             "&atom=" + block.find(".atom").val() +
             "&kind=" + $("#" + theId + " .kind").val() +
             "&data=" + escape( content ),
     success: function(msg){
        if (msg.status != "OK") {
          alert("Data not saved!\nGot error from server: " + msg.status + ", see console.");
          console.log(msg);
          // don't rollback the data (user otherwise looses it's input), just show the editor again
          showEditor( content );
        } else {
          // replace data in our form
          var name = block.find(".textdata").val( content ).attr("name");
          $("#content_data #"+name).html($(content).text().substring(0,80) + " ...");
        }
      }
   });
  */

}

/////////////////////////////
// ordering content blocks //
/////////////////////////////

function saveOrder() {
  var nr = 10;
  var inMain = false;
  $("#content article,#content h4").each(function(){
    var block = $(this);
    var id = block.attr("id");
    if (id) {
      block.find(".intro").val( (inMain) ? 'N' : 'Y' );
      block.find(".sortorder").val(nr);
      nr = nr + 10;
    } else if (block.hasClass("main")) { 
      inMain = true; 
    }
  });
}


