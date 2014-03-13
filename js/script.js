$(document).ready(function() {
  var words;
  var nextWord;

  $("#button").click(function() {
    $.ajax({
      url : "docs/tale-of-two-cities.txt",
      dataType: "text",
      success : function (data) {
        $(".text").html(data);
        words = $(".text").text().split(/ |\n/).reverse();
        nextWord = words.pop();
      }
    });
  });

  $("#nextword").click(function() {
    showNextWord();
  });

  $('#stop').hide();

  var hasPunct;
  var intervalID;
  var wpm = $('#rate').val();
  var speed = 60000 / wpm; 
  $("#start").click(function() {
    $(this).hide();
    $('#stop').show();
    intervalID = setInterval(run, speed);
  });

  $("#stop").click(function() {
    $(this).hide();
    $('#start').show();
    clearInterval(intervalID);
  });

  function run(){
    clearInterval(intervalID);
    
    if ( hasPunct )
      speed = speed * 3;
   else
      speed = 60000 / wpm; 

    showNextWord();

    intervalID = setInterval(run, speed);
  }

  function showNextWord(){
    hasPunct = false;
    var word = nextWord;
    nextWord = words.pop();
    var i = word.length / 2;
    var midchar = word.substring( i, i + 1);
    midchar = "<span>" + midchar + "</span>";
    word = word.substring(0, i) + midchar + word.substring(i + 1);

    var endchar = nextWord.substring( nextWord.length - 1 );
    if ( endchar == '.' || endchar == ',' )
      hasPunct = true;

    $(".word").empty().html(word);
  }
});
