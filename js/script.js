$(document).ready(function() {
  var words;
  var nextWord;
  var wordCount;
  var wordTimer;

  var charWidths = [27, 30, 28, 28, // a, b, c, d
                    28, 16, 28, 28, // e, f, g, h
                    12, 12, 28, 12, // i, j, k, l
                    29, 28, 28, 30, // m, n, o, p
                    28, 18, 25, 18, // q, r, s, t
                    28, 29, 38, 29, // u, v, w, x
                    29, 29];            // y, z

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

    $('.block').show().animate({width: 0}, 800);

    wpm = $('#rate').val();
    speed = 60000 / ( wpm * 1.2 ); // Bug, doesn't seem to moving as fast
    setTimeout( function() { intervalID = setInterval(run, speed) }, 800 );
  });

  $("#stop").click(function() {
    $(this).hide();
    $('#start').show();
    $('.block').hide().css('width', '100%');
    clearInterval(intervalID);
  });

  function run(){
    clearInterval(intervalID);
    
    if ( hasPunct )
      speed = speed * 2;
   else
      speed = 60000 / wpm; 

    showNextWord();

    intervalID = setInterval(run, speed);
  }

  function showNextWord(){
    var word = nextWord;
    nextWord = words.pop();
    var i = Math.floor(word.length / 2);

    if ( hasPunct )
      i -= 1;

    hasPunct = false;

    // shift is every word before the midchar plus half the midchar
    var shift = 0; 
    for ( var j = 0; j < i; j++) {
      if ( word.charCodeAt(j) >= 97 && word.charCodeAt(j) < 123 ) {
        shift += charWidths[word.charCodeAt(j) - 97];
        //console.log("word: " + word + " i/j: " + i+"/"+j + " charCodeAt: " + word.charCodeAt(j) + " shift: " + shift);
      } else {
        shift += 30;
        //console.log("word: " + word + " i/j: " + i+"/"+j + " charCodeAt: " + word.charCodeAt(j) + " shift: " + shift);
      }
    }
    shift += charWidths[word.charCodeAt(i) - 97] / 2;
    shift = 0 - shift;


    var midchar = word.substring( i, i + 1);
    midchar = "<span>" + midchar + "</span>";
    word = word.substring(0, i) + midchar + word.substring(i + 1);

    var endchar = nextWord.substring( nextWord.length - 1 );
    if ( endchar == '.' || endchar == ',' )
      hasPunct = true;

    $(".word").empty().css("margin-left", shift + "px").html(word);
  }
});
