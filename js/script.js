$(document).ready(function() {
  var words; // Object containing 'wordObjects' 
  var wordStringsArray; // Array of words in order

  var w = 0;          // Index of current word
  var wordCount;
  var wordTimer;

  var direction;

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
                    30, 30, 30, 35, // E, F, G, H
                    16, 30, 30, 30, // I, J, K, L
                    30, 30, 30, 34, // M, N, O, P
                    30, 30, 34, 30, // Q, R, S, T
                    30, 30, 50, 30, // U, V, W, X
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

  $("#prevword").click(function() {
    if ( w > 1 ) {
      w = w - 2;
      showNextWord();
    }
  });
  $("#nextword").click(function() {
    showNextWord();
  });

  $('#stop').hide();

  function processWords(data) {
    $('.progress').removeClass('hide');
    $(".text").html(data);
    wordStringsArray = $(".text").text().split(/ |\n/);

    console.log("Total word strings: " + wordStringsArray.length);

    words = new Object();
    words.length = 0;
    
    // Create an object for each word and create a DD linked list?
    wordStringsArray.forEach(function(word, index){
      if ( words[word] === undefined ) {
        words[word] = wordObject(word);
        words.length++;

        var percent = Math.floor(100 * index / wordStringsArray.length) + 1;
        setTimeout( function(){$('.progress-bar.loading').css('width', percent + '%')}, 100);
      } else {
        words[word].count++;
      }
    });

    //for ( var word in words ) {
    //  var obj = words[word];
    //  for ( var prop in obj )
    //    if ( obj.hasOwnProperty(prop) && obj.count !== undefined && obj.count > 100 )
    //      console.log(word + " " + obj.count);
    //}

    console.log("Total unique words: " + words.length);

  }

  function wordObject(wordString) {
 
    var i = Math.floor(wordString.length / 2);
    
    var word = new Object();

    word.string = wordString;
    word.hasPunctuation = false;
    word.count = 1;

    // test to see if word has punctuation so to know when to pause
    var endchar = wordString.substring( wordString.length - 1 );
    if ( endchar == '.' || endchar == ',' || endchar == ';' || endchar == '-' )
      word.hasPunctuation = true;

    // but catch these false positives
    if ( wordString == "Mr." || wordString == "Mrs." || wordString == "St." )
      word.hasPunctuation = false;

    // shift the index back to not count the punctuation
    if ( word.hasPunctuation )
      i -= 1;

    // shift is every word before the midchar plus half the midchar
    var shift = 0; 
    for ( var j = 0; j < i; j++) {
      shift += charWidths[wordString.charCodeAt(j)];
    }
    shift += Math.floor(charWidths[wordString.charCodeAt(i)] / 2);

    // inverse the shift for a negative margin
    word.shift = shift * -1;

    endchar = " " + endchar + "\n";

    var midchar = wordString.substring( i, i + 1);
    midchar = "<span>" + midchar + "</span>";
    word.html = wordString.substring(0, i) + midchar + wordString.substring(i + 1);

    return word;
  }


  var hasPunct;
  var intervalID;
  var wpm = $('#rate').val();
  var speed = 60000 / wpm; 
  $("#faster").click(function() {
    $('#rate').val( parseInt( $('#rate').val() ) + 100 );
    wpm = $('#rate').val();
    speed = 60000 / ( wpm * 1.2 ); // Bug, doesn't seem to moving as fast
  });
  $("#slower").click(function() {
    $('#rate').val( parseInt( $('#rate').val() ) - 100 );
    if ( $('#rate').val() < 0 )
      $('#rate').val( 0 );

    wpm = $('#rate').val();
    speed = 60000 / ( wpm * 1.2 ); // Bug, doesn't seem to moving as fast
  });
  $("#start").click(function() {
    $(this).hide();
    $('#stop').show();

    direction = 'forward';

    $('.block').show().animate({width: 0}, 800);

    wpm = $('#rate').val();
    speed = 60000 / ( wpm * 1.2 ); // Bug, doesn't seem to moving as fast
    setTimeout( function() { intervalID = setInterval(run, speed) }, 800 );
  });
  $("#reverse").click(function() {
    // Doesn't react if at the beginning
    if ( w == 1 )
      return;

    $(this).hide();
    $('#stop').show();

    direction = 'reverse';

    $('.block').show().animate({width: 0}, 800);

    wpm = $('#rate').val();
    speed = 60000 / ( wpm * 1.2 ); // Bug, doesn't seem to moving as fast
    setTimeout( function() { intervalID = setInterval(run, speed) }, 800 );
  });

  $("#stop").click(function() {
    $(this).hide();
    if ( direction == 'forward' )
      $('#start').show();
    else
      $('#reverse').show();
  
    // The 'blocks' are the shrinking grey divs at the start. They must be reset.
    $('.block').hide().css('width', '100%');
    clearInterval(intervalID);
  });

  function run(){
    clearInterval(intervalID);
    
    if ( words[wordStringsArray[w]].hasPunctuation )
      speed = speed * 2.5;
    else
      speed = 60000 / wpm; 

    if ( direction == 'reverse' )
      if ( w == 1 ) {
        $('#stop').click();
        return;
      } else {
        w = w - 2;
      }

    showNextWord();

    intervalID = setInterval(run, speed);
  }

  function showNextWord(){
    var word = words[wordStringsArray[w]]; // A wordObject
    $(".word").empty().css("margin-left", word.shift + "px").html(word.html);
    w++;
    
    var percent = w / wordStringsArray.length * 100;
    $('.progress-bar.reading').css('width', percent + '%');
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
