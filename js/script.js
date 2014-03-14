$(document).ready(function() {
  var words;
  var nextWord;
  var wordCount;
  var wordTimer;

  // ASCII Table at
  // http://www.theasciicode.com.ar/ascii-printable-characters/capital-letter-a-uppercase-ascii-code-65.html
  var charWidths = [30, 30, 30, 30, 
                    30, 30, 30, 30,   
                    30, 30, 30, 30,   
                    30, 30, 30, 30,   
                    30, 30, 30, 30,   
                    30, 30, 30, 30,   
                    30, 30, 30, 30,   
                    30, 30, 30, 30, // ^ 31 Control chars ^ 
                    30, 30, 30, 30, //    !  "  #
                    30, 30, 30, 30, // $  %  &  '
                    30, 30, 30, 30, // (  )  *  +
                    30, 20, 13, 30, // ,  -  .  /
                    30, 30, 30, 30, // 0, 1, 2, 3
                    30, 30, 30, 30, // 4, 5, 6, 7
                    30, 30,         // 8, 9,  
                    30, 30, 30, 30, // :  ;  <  = 
                    30, 30, 30,     // >  ?  @ 
                    30, 35, 30, 36, // A, B, C, D
                    30, 30, 30, 30, // E, F, G, H
                    16, 30, 30, 30, // I, J, K, L
                    30, 30, 30, 34, // M, N, O, P
                    30, 30, 34, 30, // Q, R, S, T
                    30, 30, 30, 30, // U, V, W, X
                    30, 30,         // Y, Z, 
                    30, 30, 30, 30, // [  \  ]  ^
                    30, 30,         // _  ` 
                    27, 30, 28, 28, // a, b, c, d
                    28, 16, 30, 28, // e, f, g, h
                    12, 12, 28, 12, // i, j, k, l
                    42, 28, 30, 30, // m, n, o, p
                    28, 18, 25, 18, // q, r, s, t
                    28, 26, 38, 29, // u, v, w, x
                    25, 29];        // y, z

  $("#load").click(function() {
    $.ajax({
      url : "docs/tale-of-two-cities.txt",
      dataType: "text",
      success : function (data) {
        processWords(data);
      }
    });
  });

  $("#nextword").click(function() {
    showNextWord();
  });

  $('#stop').hide();

  function processWords(data) {
    $('.progress').removeClass('hide');
    $(".text").html(data);
    words = $(".text").text().split(/ |\n/).reverse();
    nextWord = words.pop();
    $('.progress-bar.loading').animate({'width': '100%'}, 1000);
  }
 

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
      speed = speed * 2.5;
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
      shift += charWidths[word.charCodeAt(j)];
      printConsole(word, i, j, shift);
    }
    shift += Math.floor(charWidths[word.charCodeAt(i)] / 2);

    shift *= -1;

    var endchar = nextWord.substring( nextWord.length - 1 );
    if ( endchar == '.' || endchar == ',' || endchar == ';' || endchar == '-' )
      hasPunct = true;

    endchar = " " + endchar + "\n";
    printConsole(word, i, j, shift, endchar);

    var midchar = word.substring( i, i + 1);
    midchar = "<span>" + midchar + "</span>";
    word = word.substring(0, i) + midchar + word.substring(i + 1);

    $(".word").empty().css("margin-left", shift + "px").html(word);

  }

  function printConsole(word, i, j, shift, end) {
    end = typeof end !== 'undefined' ? end : ' ';
    console.log(
        "word: " + word + 
        " letter: " + word[j] + 
        " j/i: " + j+"/"+i + 
        " charCode: " + word.charCodeAt(j) + 
        " hasPunct: " + hasPunct + 
        " nextWord: " + nextWord +
        " shift: " + shift + end 
    );
  }


});
