/*jslint passfail: false, plusplus: true, regexp: true, sloppy: true, sub: true, white: true*/
/*global $, jQuery, console*/
/**
* @author Chris Jordan <toferj@gmail.com>
* @namespace $hm
* @createDate 06 JUL 2016
*
* jQuery is required to be loaded in the header before this file.
*
*/
var $hm = $hm || {};

// create a page specific namespace within the hm namespace if it doesn't exist already
$hm.game = $hm.game || {};

$hm.game.init = function(){
    $hm.game.currentPuzzle = [];
    $hm.game.missedGuesses = [];
    $hm.game.currentGuess = '';
    $hm.game.goodGuessCount = 0;
    $hm.game.gameover = false;
    $hm.game.puzzle = '';
    $hm.game.puzzlecategory = '';

    $hm.game.jPuzzle = $('#puzzle');
    $hm.game.jSprite = $('#hmsprite');
    $hm.game.jRdyPlr = $('#btnReadyPlayerOne');

    $hm.game.jSprite.removeClass().addClass('newgame');
    $hm.game.jRdyPlr.hide();
    $('.lbcover-off').removeClass().addClass('lbcover');
    $('.LBSelection-GameOver,.LBSelection').removeClass().addClass('LBSelection');

    // start the game
    $hm.game.start();
};

$hm.game.start = function(){
    $hm.game.jPuzzle = $('#puzzle');

    //prompt the user for puzzle category
    $hm.game.jPuzzle.empty().append($hm.game.buildPrompt());

    //puzzle category prompt handler
    //get the random word for the puzzle based on the category selection
    $('.startbutton').off().on('click',function(){
        var category = $('#puzzlecategory').val().split('|');
        $hm.game.puzzlecategory = category[1];
        $hm.game.getRndWrd(category[0]);
    });
    //get the puzzle word (this is the old way to do it... without the categories.)
    //$hm.game.getRandomWord(5,12);
};

$hm.game.play = function(){
    var local = {};

    //put category on screen
    $('#hint').empty().append('Category: ' + $hm.game.puzzlecategory);

    //build the puzzle on screen
    $hm.game.jPuzzle.empty().append($hm.game.buildPuzzle($hm.game.puzzle));

    //uncover the letter bank
    $('.lbcover').removeClass().addClass('lbcover-off');
    
    $hm.game.jRdyPlr.text('Start Over').show();
    //Guess handler
    $('.LBSelection').off().on('click',function(){ 
        var jThis = $(this), guess = jThis.attr('data-guess');
        if(!jThis.hasClass('guessed')){
            jThis.addClass('guessed');
            $hm.game.makeguess(guess)
        }
    });

    //play again handler
    $('#playingfield').off().on('click','#btnReadyPlayerOne',function(){
        $hm.game.init();
    });

    //https://en.wikipedia.org/wiki/<word>
    //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=<word>
    //http://www.merriam-webster.com/dictionary/<word>
};

$hm.game.makeguess = function(guess){
    //loop over the current puzzle looking for matches if we find one reveal it on screen
    //if no match is found then add this guess to the list of missed guesses.
    var i,n,d, badGuess = true, puzzleSolved = false;
    for(i = 0; i < $hm.game.currentPuzzle.length; i++){
        if(!$hm.game.currentPuzzle[i].found && $hm.game.currentPuzzle[i].letter.toUpperCase() === guess){
            $hm.game.goodGuessCount++;
            $hm.game.currentPuzzle[i].found = true;
            $('#P'+i).empty().append(guess);
            badGuess = false;
        }
        else if(!$hm.game.currentPuzzle[i].found && ($hm.game.currentPuzzle[i].letter === ' ' || $hm.game.currentPuzzle[i].letter === '-' || $hm.game.currentPuzzle[i].letter === "'")){
            $hm.game.goodGuessCount++;
            $hm.game.currentPuzzle[i].found = true;
        }
        //console.log($hm.game.goodGuessCount + '/' + $hm.game.currentPuzzle.length);
        if($hm.game.goodGuessCount === $hm.game.currentPuzzle.length){
            puzzleSolved = true;
        }
    }
    if(puzzleSolved){
        $hm.game.gameover = true;
        $hm.game.jSprite.removeClass().addClass('youwin');
        $hm.game.jRdyPlr.text('Play Again').show();

        //freeze the letter bank as it is at the time the game ends
        $('.LBSelection').off('click').removeClass('LBSelection').addClass('LBSelection-GameOver');
        for(d = 0; d < $hm.game.currentPuzzle.length; d++){
            $('#P'+d).css({color:'#00CC00'}).empty().append($hm.game.currentPuzzle[d].letter.toUpperCase());
        }
    }
    else if(badGuess && $.inArray(guess,$hm.game.missedGuesses) < 0){
        $hm.game.missedGuesses.push(guess);
        if($hm.game.missedGuesses.length === 6){
            $hm.game.gameover = true;
            $hm.game.jSprite.removeClass().addClass('gameover');
            //freeze the letter bank as it is at the time the game ends
            $('.LBSelection').off('click').removeClass('LBSelection').addClass('LBSelection-GameOver');
            //loop over the current puzzle filling in all of the letters NOT found
            for(d = 0; d < $hm.game.currentPuzzle.length; d++){
                if(!$hm.game.currentPuzzle[d].found){
                    $('#P'+d).css({color:'red'}).empty().append($hm.game.currentPuzzle[d].letter.toUpperCase());
                }
            }
            $hm.game.jRdyPlr.text('Play Again').show();
        }
        else{
            $hm.game.jSprite.removeClass().addClass('deadman'+$hm.game.missedGuesses.length);
        }
    }
};

$hm.game.buildPrompt = function(){
    var i, htm, categories;

    categories = [
        [13, 'Easy'],
        [14, 'Medium'],
        [15, 'Hard'],
        [16, 'Animals'],
        [17, 'Food &amp; Cooking'],
        [18, 'Household Items'],
        [19, 'People'],
        [20, 'Travel'],
        [999,'Random']
    ];
    htm = [];
    htm.push('<div style="text-align:center;margin-top:25px;">');
    htm.push('Select a puzzle category<br />');
    htm.push('<select id="puzzlecategory" class="ui-corner-all">');
    for(i = 0; i < categories.length; i++){
        htm.push('<option value="' + categories[i][0] + '|' + categories[i][1] + '">' + categories[i][1] + '</option>');
    }
    htm.push('</select>');
    htm.push('<br />');
    htm.push('<button class="startbutton ui-corner-all">PLAY</button>');
    htm.push('</div>');
    return htm.join('');
}

$hm.game.buildPuzzle = function(word){
    var i,n, puzzle = [], aWord = word.split('');
    console.log(word);
    for(i = 0; i < aWord.length; i++){
        $hm.game.currentPuzzle.push({
            letter: aWord[i],
            found: false
        });
    }

    //loop over aWord creating a series of divs with an ID equal to "P"+the position in the puzzle cooresponding to that letter
    puzzle.push('<div style="text-align:center; width:100%;">');
    for(n = 0; n < aWord.length; n++){
        if(aWord[n] === ' '){
            puzzle.push('<div class="puzzlepiece space">&nbsp;</div>');
        }
        else if(aWord[n] === '-'){
            puzzle.push('<div class="puzzlepiece">&ndash;</div>');   
        }
        else if(aWord[n] === "'"){
            puzzle.push('<div class="puzzlepiece">&rsquo;</div>');   
        }
        else{
            puzzle.push('<div id="P'+n+'" class="puzzlepiece">&nbsp;</div>');
        }
    }
    puzzle.push('</div>');
    return puzzle.join('');
};

$hm.game.getRndWrd = function(category){
    $.ajax({
        type: 'post',
        url: 'services/crawler.cfc?method=getRandomWord',
        dataType: 'json',
        data: {
            category: category
        },
        success: function(data){
            var jData = JSON.parse(data);
            if(jData.success){
                $hm.game.puzzle = jData.words.pop();
                $hm.game.play();
            }
        }
    })
};

$hm.game.getRandomWord = function(min,max){
    //we need to generate a random number between min and max...
    var l = Math.floor(Math.random() * (max - min + 1)) + min;
    $.ajax({
        type: "GET",
        url: 'http://randomword.setgetgo.com/get.php',
        dataType: "jsonp",
        data:{
            len: l
        },
        jsonpCallback: '$hm.game.rndwordcallback'
    });
};

$hm.game.rndwordcallback = function(data){
    $hm.game.puzzle = data.Word;
    $hm.game.start();
}

jQuery(document).ready(function(){
    // call the init function
    $hm.game.init();
});