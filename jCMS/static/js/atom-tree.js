
//Johan Coppieters 
//- mar 2011 - rWorks
//- mar 2013 - jCMS



///////////////////////
//tree functions    //
///////////////////////

/* gService is prefilled by the calling template (images, files, forms, ...) */
/* gRoot is prefilled by the calling template (0, 1, ...) */
var gCurrentNode = "";
var gPleaseOpen = "";
var gRootId = "id_"+gRoot;

function warnUser(message) {
  $('#right_cont').html("<p class='warning'>" + message + "</p>");
}

function getNode(id) {
  if (typeof getPage == "function") {
      // call the getPage function if defined by the webpage
      getPage(id);
      
  } else if (id != gRootId) {
    gCurrentNode = id;
    $.getJSON("./"+gService, {request: 'getnode', node: id},
        function(msg){
           if (msg.substring(0,3) == "NOK") {
             warnUser("Got error from server: " + msg);
           } else {
             $("#right_cont").html(msg);
         }
    });
  }
}


$(document).ready(function () { 

  $("#tree")

  .bind("before.jstree", function(e, data) {
    var aNode = data.args[0];
    var nodeId = (typeof aNode == "array") ? aNode.attr("id") : "id_xx";
    
    if ((data.func == "delete_node") && (gService != "sitemap")) { 
      // we don't actually do deletes, just mark the node as inactive in the database and rename it in the tree
      // console.log("Tree - Delete: " + aNode.text());
      
      $.getJSON("./sitemap", {request: 'delete', node: nodeId},
        function(msg){
          if (msg.status == "OK") {
            aNode.addClass("deleted");
            aNode = aNode.find("a:first");
            var icn = aNode.children("ins").clone();
            
            // rename generates a callback and we don't want an update in the database
            // data.inst.set_text ( aNode , text ) jsTree.rename(aNode, "(" + aNode.text() + ")");
            var aName = data.inst.get_text(aNode);
            if (aName.charAt(0) != '(') {
              aNode.text("(" + aName + ")").prepend(icn);
            }
            getNode(nodeId);
          }
          if (msg.status == "NOK") {
            console.log(msg);
            warnUser("The deletion of this item failed.<br>server status: " + msg.status);
          }
          if (msg.status == "NAL") {
            warnUser("You are not allowed to delete this item, sorry.");
          }
      });
      e.stopImmediatePropagation();
      return false; 

      
    } else if (data.func == "close_node") {
      console.log("Tree - close: " + nodeId);
      console.log(aNode);
      // don't allow closing the root node
      if (nodeId == gRootId) {
        e.stopImmediatePropagation();
        return false;
      }

      
    } else if (data.func == "rename_node") {
        console.log("Tree - Before: rename_node, please-open = " + gPleaseOpen);
        if (gPleaseOpen) {
          // we're here after a create_node, set the name and open the item for editing
          $.getJSON("./"+gService, {request: 'rename', name: data.args[1], node: gPleaseOpen},
              function(msg){
                if (msg.status == "OK") {
                 doEdit(aNode);
                 gPleaseOpen = null;
               }
          });
        }
    }
  })

  
  .bind("delete.jstree", function (e, data) {
    var aNode = data.rslt.obj;
    var nodeId = aNode.attr("id");
    console.log("Tree - Delete: " + nodeId);
    
    $.getJSON("./"+gService, {request: 'delete', node: nodeId},
        function(msg){
          if (msg.status == "NAL") {
            warnUser("You are not allowed to delete this item, sorry.");
            $.jstree.rollback(data.rlbk);
    
          } else if (msg.status == "OK") {
            warnUser("The item has been deleted.");
            
          } else {
            console.log(msg);
            warnUser("The deletion of this item failed.<br>server status: " + msg.status);
            $.jstree.rollback(data.rlbk);
          }
    });
  })

  
  .bind("rename.jstree", function (e, data) {
    var aNode = data.rslt.obj, text = data.rslt.new_name;
    var nodeId = aNode.attr("id");
    console.log("Tree - Rename: " + nodeId + " -> " + text);
    
    $.getJSON("./"+gService, {request: 'rename', name: text, node: nodeId},
        function(msg){
          if (msg.status == "NAL") {
            warnUser("You are not allowed to rename this item, sorry.");
            $.jstree.rollback(data.rlbk);
    
          } else if (msg.status != "OK") {
            console.log(msg);
            warnUser("The rename of this item failed.<br>server status: " + msg.status);
            $.jstree.rollback(data.rlbk);
          }
    });
  })

  
  .bind("move_node.jstree", function (e, data) {
    var aNode = data.rslt.o, refNode = data.rslt.r, type = data.rslt.p;
    var nodeId = aNode.attr("id"), refNodeId = refNode.attr("id");
    console.log("Tree - Move: " + aNode.text() + " " + type + " " + refNode.text());

    // Allow only one dummy node "website" as toplevel
    if ((refNodeId == "id_0") && ((type == "before") || (type == "after"))) {
      warnUser("Can't move this element.");
      $.jstree.rollback(data.rlbk);

    } else {
      // type = "before", "after" or "inside"
      $.getJSON("./"+gService, {request: 'move', refnode: refNodeId, type: type, node: nodeId},
          function(msg) {
            if (msg.status == "NAL") {
              warnUser("You are not allowed to move this item, sorry.");
              $.jstree.rollback(data.rlbk);
    
            } else if (msg.status != "OK") {
              console.log(msg);
              warnUser("The move of this item failed.<br>server status: " + msg.status);
              $.jstree.rollback(data.rlbk);
            }
      });
    }  
  })

  
  .bind("select_node.jstree", function (e, data) {
    // console.log("Tree - select");
    var nodeId = $(data.args[0]).parent().attr("id");
    if (gCurrentNode == nodeId) {
      doEdit();
    } else {
      gCurrentNode = nodeId;
    }
  })

  
  .bind("deselect_node.jstree", function (e, data) {
    // console.log("Tree - deselect");
    gCurrentNode = "";
  })

  
  .bind("create_node.jstree", function(e, data) {
    var title = data.args[2].data[0], aNode = data.rslt.obj;
    var type = data.args[1] || "inside";  // insert type = before, after, inside, first, last
    var refNode = (type == "inside") ? data.args[0] : data.args[1];
    var refNodeId = refNode.attr("id");
    
    $.getJSON("./"+gService, {request: 'insert', refnode: refNodeId, type: type, name: title},
        function(msg){
          if (msg.status == "NAL") {
            warnUser("You are not allowed to create and item here, sorry");
            $.jstree.rollback(data.rlbk);
    
          } else if (msg.status == "NOK") {
            console.log(msg);
            warnUser("Creation of a new item failed.<br>server status: " + msg.status);
            $.jstree.rollback(data.rlbk);
    
          } else {
            // remember this node, it will go into "rename" mode now, so after rename -> open it up for editing
            // console.log("create - setting node id to " + msg.node);
            gPleaseOpen = msg.node;
            aNode.attr("id", msg.node);
            
            warnUser("Please choose a name for your page and press the 'enter'-key.");
          }
    });
  })

  
  .jstree({
    plugins : [ "themes", "html_data", "ui", "crrm", "dnd", "types" ],
    core : {
      initially_open : [gRootId],
      strings: { new_node: "New page" }
    },
    themes : {
      theme: "default"   // alternatives: "apple", "default" or false (= no theme)
    },
    ui: {
      select_limit: 1
    },
    types: {
      "root" : {
        deletable: false,
        renameable: false,
        draggable: false,
        clickable: true
      },
      "image" : {
        valid_children : "none",
        creatable: false,
        icon : {
          image : gImages + "/extentions/jpg.gif" }
      },
      "file" : {
        valid_children : "none",
        creatable: false,
        icon : {
          image : gImages + "/extentions/xxx.gif" }
      },
      "folder" : {
        valid_children : [ "file", "image", "folder" ]
        }   
      }
  });


});

function doAddFolder() {
  var t = $("#tree").jstree("get_selected"); 
  gNextType = "F";
  if (t) {
    $("#tree").jstree("create", t, "inside", ({ attr: { rel : "folder" } })); 
  } else { 
    WarnUser("Please select an item first");
  }
}
function doAddImage() {
  var t = $("#tree").jstree("get_selected"); 
  gNextType = "I";
  if (t) {
    $("#tree").jstree("create", t, "inside", ({ attr: { rel : "image" } })); 
  } else { 
    WarnUser("Please select an item first");
  }
}
function doRename() {
  var t = $("#tree").jstree("get_selected"); 
  if (t) {
    $("#tree").jstree("rename", null); // renames current selection
  } else {
    warnUser("Please select an item to rename first");
  }
}
function doDelete() {
  var t = $("#tree").jstree("get_selected"); 
  if (t) {
    $("#tree").jstree("remove", t);
  } else {
    warnUser("Please select an item to delete first");
  }
}
function doEdit(aNode) {
  if (aNode) $("#tree").jstree("select_node", aNode, true);
  
  var t = aNode || $("#tree").jstree("get_selected"); 
  
  if (t != '') {
    getNode(t.attr("id"));
  } else {
    warnUser("Please select an item to edit first");
  }
}
