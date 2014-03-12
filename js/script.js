$(document).ready(function() {
  var words;

  $("#button").click(function() {
    $.ajax({
      url : "docs/tale-of-two-cities.txt",
      dataType: "text",
      success : function (data) {
        $(".text").html(data);
        words = $(".text").text().split(' ');
      }
    });
  });

  $("#nextword").click(function() {
    nextWord();
  });

  $('#stop').hide();

  var intervalID;
  $("#start").click(function() {
    $(this).hide();
    $('#stop').show();
    intervalID = setInterval(nextWord, 500);
  });

  $("#stop").click(function() {
    $(this).hide();
    $('#start').show();
    clearInterval(intervalID);
  });

  function nextWord(){
    var word = words.pop();
    $(".word").empty().html(word);
  }
});
