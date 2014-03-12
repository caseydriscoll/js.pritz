$(document).ready(function() {
  $("#button").click(function() {
    $.ajax({
      url : "docs/tale-of-two-cities.txt",
      dataType: "text",
      success : function (data) {
        $(".text").html(data);
      }
    });
  });
});
