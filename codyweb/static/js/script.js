$(document).ready(function() {

  $("form").validate();

  $("form #submitter").click(function() {
    $("form #request").val("send");
    $("form").submit();
  });
});