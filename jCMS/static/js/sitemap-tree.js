//
// Johan Coppieters 
//   - mar 2011 - rWorks
//   - mar 2013 - jCMS
//
//
///////////////////////
// tree functions    //
///////////////////////

var gCurrentNode = "";
var gPleaseOpen = "";

$(document).ready(function () { 

	$("#sitemap")
	
	.bind("loaded.jstree", function(e, data) {
		Startup(data.inst);
	 })
	 
    .bind("before.jstree", function(e, data) {
    	if (data.func == "delete_node") { 
 		      var NODE = data.args[0];
	          // we don't actually delete, just mark the node as inactive in the database and rename it in the tree
			  console.log("Tree - Delete: " + data.inst.get_text(NODE));
	          $.ajax({
	       	   type: "GET", url: "./sitemap",
	       	   data: "oper=delete&node=" + NODE.id,
	       	   success: function(msg){
			      // $.jstree.rollback(RB);
			      if (msg.substring(0,2) == "OK") {
	 	 	       	   var obj = data.inst.get_node(NODE);
	 	 	       	   obj.addClass("deleted");
	 	 	       	   obj = obj.find("a:first");
					   var icn = obj.children("ins").clone();
	 	 	       	   // rename generates a callback and we don't want an update in the database
	 	 	       	   // TREE_OBJ.rename(NODE, "(" + TREE_OBJ.get_text(NODE) + ")");
					   obj.text("(" + data.inst.get_text(NODE) + ")").prepend(icn);
	 	          }
		       	  if (msg.substring(0,3) == "NOK") {
		     	   	   WarnUser("The deletion of this item failed.");
		     	   	   alert("Got error from server: " + msg);
		          }
		       	  if (msg.substring(0,3) == "NAL") {
		     	   	   WarnUser("You are not allowed to delete this item, sorry.");
		          }
	       	   }
	       	 });
	       	 e.stopImmediatePropagation();
	         return false; 
	         
	    } else if (data.func == "close_node") {
	    	console.log("Tree - close: " + data.args[0].attr("id"));
	    	// don't allow closing the root node
            if (data.args[0].attr("id") == "id_0") {
            	console.log("Tree - prevent closing");
				e.stopImmediatePropagation();
	            return false;
            }
	    
	    } else if (data.func == "create_node") {
            WarnUser("Please choose a name for your page and press the 'enter'-key.");
	    	     
	 	} else {
	 		//console.log("Tree - Before: " + data.func);
	 		//return true;
	 	}
	 })
	 
    .bind("rename.jstree", function (e, data) {
    	var NODE = data.rslt.obj, TEXT = data.rslt.new_name, TREE_OBJ = data.inst;
    	var NODE_ID = NODE.attr("id");
		  console.log("Tree - Rename: " + NODE_ID + " -> " + TEXT);
          $.ajax({
       	   type: "GET", url: "./sitemap",
       	   data: "request=rename&node=" + NODE_ID +  "&title=" + TEXT,
       	   success: function(msg){
	       	  if (msg.substring(0,3) == "NAL") {
	     	   	  WarnUser("You are not allowed to rename this item, sorry.");
	     	   	  $.jstree.rollback(data.rlbk);
	     	   	  
	          } else if (msg.substring(0,2) != "OK") {
     	   	      // alert("Got error from server: " + msg);
			      WarnUser("The rename of this item failed.");
	       	      $.jstree.rollback(data.rlbk);
	       	      
             } else {
 	        	if (gPleaseOpen == NODE_ID) GetPage(NODE_ID);
             }
	       	 gPleaseOpen = "";
       	   }
       	 });
	 })
	 
    .bind("move_node.jstree", function (e, data) {
    	var NODE = data.rslt.o, REF_NODE = data.rslt.r, TYPE = data.rslt.p, TREE_OBJ = data.rslt.rt;
    	var NODE_ID = NODE.attr("id"), REF_NODE_ID = REF_NODE.attr("id");
		// console.log("Tree - Move: " + NODE.text() + " " + TYPE + " " + REF_NODE.text());
		
		// Allow only one dummy node "website" as toplevel
		if ((REF_NODE_ID == "id_0") && ((TYPE == "before") || (TYPE == "after"))) {
 	   	    WarnUser("Can't move this element.");
			// alert("Move refused");
			$.jstree.rollback(data.rlbk);
			
		} else {
           // type = "before", "after" or "inside"
           $.getJSON("./sitemap", {request: 'move', refnode: REF_NODE_ID, type: TYPE, node: NODE_ID},
        	   function(msg) {
        	   	   // console.log(msg);
            	   if (msg.status == "NAL") {
 		     	   	  WarnUser("You are not allowed to move this item, sorry.");
 		     	   	  $.jstree.rollback(data.rlbk);
 		     	   	  
 		           } else if (msg.status != "OK") {
     	   	   		  // alert("Got error from server: " + msg);
		     	   	  WarnUser("The move of this item failed.<br><small>" + msg + "</small>");
		       		  $.jstree.rollback(data.rlbk);
          	       }
          	});
		}	
	 })
	 
    .bind("xselect_node.jstree", function (e, data) {
    	// console.log("Tree - select");
    	var NODE = $(data.args[0]).parent();
		gCurrentNode = NODE; // .attr("id");		    
	 })
	 
    .bind("xdeselect_node.jstree", function (e, data) {
    	// console.log("Tree - deselect");
     	gCurrentNode = "";
	 })
	 
    .bind("ondblclk.jstree", function (e, data) {
    	var NODE_ID = data.args[0].attr("id");
    	console.log("Tree - dblClick -> " + NODE_ID);
        GetPage(NODE_ID);
	 })
	 
    .bind("create_node.jstree", function(e, data) {
    	var NODE = data.args[0], REF_NODE = data.args[1], TYPE = data.args[2], 
    	    TREE_OBJ = data.inst, RB = data.rlbk, 
    	    NODE_ID = NODE.attr("id"), REF_NODE_ID = REF_NODE.attr("id");
    	console.log(data);
        // type = "before", "after" or "inside"
        $.ajax("./sitemap", { request: insert, refnode: REF_NODE_ID, type: TYPE, title: NODE.text()} ,
       	   function(msg){
        	 if (msg.status == "NAL") {
     	   	    WarnUser("You are not allowed to create and item here, sorry");
     	   	    $.jstree.rollback(RB);
     	   	    
             } else if (msg.status == "NOK") {
     	   	    // alert("Got error from server: " + msg);
     	   	    WarnUser("Creation of a new item failed.<br><small>" + msg + "</small>");
		       	$.jstree.rollback(RB);
		       	
             } else {
                // strip non numeric chars and ask to open this item
      	   		gPleaseOpen = msg.substring(0,3) + parseInt(msg.substring(3));
	       	    NODE.id = gPleaseOpen;
        	 }
       });
     })
     
     .bind("loaded.jstree", function (event, data) {
        console.log("TREE IS LOADED");
     })
     
	 .jstree({
	      plugins : [ "themes", "html_data", "ui", "crrm", "dnd", "types" ],
	      core : {
	      	initially_open : ['id_0'],
		  	strings: {
				new_node: "New page"  // Item.kDefaultName !!
		  	}
	      },
	      themes : {
	      	theme: "default"   // alternatives: "apple", "default" or false (= no theme)
	      },
		  ui: {
			select_limit: 1
		  },
	      types: {
	    	  // "default" : {},
	    	  "root" : {
	    		  deletable: false,
	    		  renameable: false,
	    		  draggable: false,
	    		  clickable: true
	    	  },
		      "folder" : {renameable: true},
			  "file" : { icon : { image : gImages+"/extentions/xxx.gif" } }
	      }
     });
	 

});

function WarnUser(message) {
	$('#right_cont').html("<p class='warning'>" + message + "</p>");
}
function doAdd() {
	var t = $("#sitemap").jstree("get_selected"); 
	if (t)
		t.create_node();
	else 
		WarnUser("Please select an item first");
}
function doRename() {
	var t = $("#sitemap").jstree("get_selected"); 
	if (t)
		$("#sitemap").jstree("rename"); // renames current selection
	else 
		WarnUser("Please select an item to rename first");
}
function doDelete() {
	if (gCurrentNode != '') 
		$("#sitemap").jstree("delete_node", gCurrentNode);
	else 
		WarnUser("Please select an item to delete first");
}
function doEdit() {
	var t = $("#sitemap").jstree("get_selected"); 
	if (t != '') 
		GetPage(t.attr("id"));
	else
		WarnUser("Please select an item to edit first");
}
