$(document).ready(function() {
  var words;

  $("#button").click(function() {
    $.ajax({
      url : "docs/tale-of-two-cities.txt",
      dataType: "text",
      success : function (data) {
        $(".text").html(data);
        words = $(".text").text().split(/ |\n/).reverse();
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
    var wpm = $('#rate').val();
    var speed = 60000 / wpm; 
    intervalID = setInterval(nextWord, speed);
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
