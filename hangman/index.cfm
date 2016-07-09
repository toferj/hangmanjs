<cfscript>
    //variables.svc = createObject('component','services.crawler');
    //variables.svc.getRandomWord(13);
    variables.aLetters = [
        ['A','B','C','D','E','F','G','H','I','J'],
        ['K','L','M','N','O','P','Q','R','S'],
        ['T','U','V','W','X','Y','Z']
    ];
    variables.aQWERTY = [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M']
    ];
    variables.aLetterBank = variables.aQwerty;
    //variables.aLetterBank = variables.aLetters;
</cfscript>
<cfoutput>
<!doctype html>
<html>
    <head>
        <title>HM</title>
        <!-- CSS -->
        <link rel="stylesheet" type="text/css" href="libs/jQuery-ui-1.11.4/jquery-ui.min.css" />
        <link rel="stylesheet" type="text/css" href="css/hm.css" />

        <!-- Javascript -->
        <script type="text/javascript" src="libs/jQuery2.2.2/jquery-2.2.2.min.js"></script>
        <script type="text/javascript" src="libs/jQuery2.2.2/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/hm.js"></script>
    </head>
    <body style="color:white; font-weight:bold; font-size:15px; font-family:arial;">
        <div id="playingfield">
            <!--- SPRITE AREA... where we'll keep track of the number of guesses with our hangman --->
            <div id="hmsprite" class="newgame"></div>

            <!--- SPLASH AREA --->
            <div id="splasharea" style=""></div>

            <!--- WRONG GUESSES --->
            <div style="position:absolute; left:325px; top:230px; padding:5px 0;">
                <span style="letter-spacing:3px;">LETTER BANK</span>
                <div id="letterbank">
                    <div class="lbcover">
                    <cfloop array="#variables.aLetterBank#" index="variables.row">
                        <cfloop array="#variables.row#" index="variables.letter">
                            <div class="LBSelection" data-guess="#variables.letter#">#variables.letter#</div>
                        </cfloop>
                        <br />
                    </cfloop>
                    </div>
                </div>
            </div>

            <!--- THE PUZZLE AREA --->
            <div id="puzzle"></div>
            
            <!--- CATEGORY DISPLAY --->
            <div id="hint">&nbsp;</div>

            <!-- THE AREA FROM WHERE WE WILL GET USER INPUT (GUESSES) -->
            <div id="commandline">
                <!--- <div class="guessField">Guess &gt;&nbsp; <input type="text" name="guess" id="guess" value="" maxlength="1"></div> --->
                <div id="ReadyPlayerOne">
                    <button id='btnReadyPlayerOne' class='ui-corner-all'>Play Again</button>
                </div>
            </div>
        </div>
    </body>
</html>
</cfoutput>