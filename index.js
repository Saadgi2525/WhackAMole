var molesNumber = NaN;

function createTable(){
    $("#main-interface").remove();
    $("body").prepend(`<div id="game-board"></div>`)
    $("#game-board").before(`<div class="text-decorator fredoka-300"  id="score"><p>Score: </p><p id="score-count"></p><p>Timer: </p><p id="timer-count"></p></div>`)
    
    var moleClass = "mole";
    var feature = `<a class=` + moleClass + `></a>`  
    for(var i = 0; i < molesNumber; i++){
        $("#game-board").append(feature);
    }

    var tableExtraColumns = molesNumber / 4 - 4;
    if (tableExtraColumns === 0){
        $("#game-board a").css("width", 100 + "px");
        $("#game-board a").css("height", 100 + "px");
        $("#game-board").css("max-width", 650 + "px");
        $("#game-board").css("gap", 40 + "px");
        $(".mole").css("background-size", 300 + "px")
    }
    if (tableExtraColumns > 0){
        var newWidth = 100 - ((tableExtraColumns - 1) % 2) * 10;
        $("#game-board a").css("width", newWidth + "px");
        $("#game-board a").css("height", newWidth + "px");
        var newMaxWidth = 650 + tableExtraColumns * 40;
        if (newMaxWidth > 1000)
            newMaxWidth = 1000
        $("#game-board").css("max-width", newMaxWidth + "px");
        var newGap = 40 - tableExtraColumns * 10;
        $("#game-board").css("gap", newGap + "px");
        $(".mole").css("background-size", 300 + "px")
    }
}

var selectedDifficulty = 'normal';
$(".difficulty-button").on('click', function(){
    selectedDifficulty = $(this).data('diff');

    $('.difficulty-button').removeClass('selected');
    $(this).addClass('selected');
})

var intervalTime;
$("#submitButton").click(function(){
    switch(selectedDifficulty){
        case 'easy':
            intervalTime = 2000;
            break;
        case 'normal':
            intervalTime = 1000;
            break;
        case 'hard':
            intervalTime = 500;
            break;
        case 'impossible':
            intervalTime = 200
            break;
    }

    var value = $("#molesNumberInput").val();
    var errors = "";
    if (value < 8 || value > 32){
        errors += "There cannot be more than 32 and less than 8 moles.";
    }
    if (value % 4 !== 0){
        errors +=  "There should be a divisible to 4 amount of moles";
    }
    if (value === ""){
        errors += "Input a value";
    }

    if (errors.length > 0){
        alert(errors);
        return;
    }

    molesNumber = +value;

    createTable();
    startGame();
})

var timer;
var score = 0;
var countdown;
var moleInterval;

function showMole(){
    $(".mole").removeClass("show").off("click");

    var $randomMole = $(".mole").eq(Math.floor(Math.random() * molesNumber));
    
    $randomMole.addClass("show").one("click", onMoleClick);
}

function onMoleClick(){
    score++;
    $("#score-count").text(score);
    $(this).removeClass("show").off("click");
}

function startGame(){
    score = 0;
    $("#score-count").text(score);
    timer = 60;
    $("#timer-count").text(timer);

    countdown = setInterval(() => {
        timer--;
        $("#timer-count").text(timer);

        if(timer <= 0){
            $("#game-board").remove();
            $("#score").after(`<p class="text-decorator fredoka-300">See your final score above. To play again, refresh the page.</p>`)
            clearInterval(countdown);
            clearInterval(moleInterval)
        }
    }, 1000);

    moleInterval = setInterval(() => {
        showMole();
    }, intervalTime);
}

if (window.innerWidth < 800) {
    $("#mobile-warning").show();
    $("#main-interface").hide();

    $("#force-play-button").on("click", function () {
      $("#mobile-warning").hide();
      $("#main-interface").show();
    });
  }
