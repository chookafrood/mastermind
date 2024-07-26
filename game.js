var colorChoices = ["black", "white", "red", "yellow", "green", "blue"]
var userAnswer = [];
var masterCode = [];
var level = 0;

var started = false;






// ************************** START GAME - GENERATE MASTER CODE *******************

$(document).keypress(function() {
  if (!started) {
    $("h2").text("");

      resetBoard();


      started = true;
      level++;

      generateMasterCode();
      highlightLevel(level);
      enableNewButtons(level);
  } 
});




// ************************************************************************
// ******************** SUBMIT CODE - EVENT LISTENER **********************
// ************************************************************************

$("#submit").click(function() {

  userAnswer = [];


  for (i=1; i<5; i++) {
    var buttonColor = $("#guess_" + level + "_" + i).attr("color");
    userAnswer.push(buttonColor);
  }

  var grayCheck = false;
  for (i=0; i<4; i++) {
    if (userAnswer[i] == "gray") {
      grayCheck = true;
    }
  }

  if (grayCheck) {
    alert("Please select a color for each position before submitting!");
  } else {
   

    disableOldButtons(level);
    level++;

    checkAnswer(userAnswer);

 

        if (level > 10) {
          gameOver("lose");
        }
      highlightLevel(level);

  
      if (level > 1) {

      for (i=1; i<5; i++) {
        var previousColor = $("#guess_" + (level - 1) + "_" + i).attr("color");
        $("#guess_" + (level) + "_" + i).removeClass("gray").addClass(previousColor).attr("color", previousColor);
      }
    }
      enableNewButtons(level);

      }
})








// ************************************************************************
// ************************************************************************
// ************************* FUNCTIONS ************************************
// ************************************************************************
// ************************************************************************












// ************************************************************************
// *********************** GENERATE MASTERCODE ****************************
// ************************************************************************

function generateMasterCode() {
  $(".digit").removeClass("gray");

  for (x=0; x<4; x++) {
    var randomNumber = Math.floor(Math.random() * 6);
    var randomCodeColor = colorChoices[randomNumber];
    masterCode.push(randomCodeColor);
  };
    $(".digit").hide();
    displayMasterCode();
}












// ************************************************************************
// ************** ASSIGN LISTENERS TO BUTTONS ON ACTIVE LEVEL  ************
// ************************************************************************

function enableNewButtons(level) {

  $(".level_" + level).click(function(event) {

 

  


    //  1. GET "color" value of pressed button (by ID)

    var currentColor = $(this).attr("color");
 
    //  2. remove that class from (this)

    $(this).removeClass(currentColor);

    //  3. determine next color in colorChoices

    if (currentColor == "gray") {
      currentColor = "blue";
    }

    var currentIndex = colorChoices.indexOf(currentColor);
    if (currentIndex == 5) {
      currentIndex = 0;
      currentColor = colorChoices[currentIndex];
    } else {
      currentIndex ++;
      currentColor = colorChoices[currentIndex];
    }

    //  4. add that class to (this)

    $(this).addClass(currentColor);

    //  5. SET new "color" value

    $(this).attr("color", currentColor);

  })
}








// ************************************************************************
// ********************** CHECK ANSWER ************************************
// ************************************************************************


function checkAnswer(answer) {
  var blackPegs = 0;
  var whitePegs = 0;
  var masterCodeTest = masterCode.slice();
  var userAnswerTest = answer;
  var results = [];

  for (i=0; i<4; i++) {
    if (userAnswerTest[i] == masterCodeTest[i]) {
      blackPegs++;
    }
  }

  for (i=3; i>=0; i--) {
    if (userAnswerTest[i] == masterCodeTest[i]) {
      userAnswerTest.splice(i, 1);
      masterCodeTest.splice(i, 1);
    }
  }

  var numberOfChecks = userAnswerTest.length;

  for (i=0; i<numberOfChecks; i++) {
    for (ii=0; ii<numberOfChecks; ii++) {
      if (userAnswerTest[i] == masterCodeTest[ii]) {
        whitePegs++;
        userAnswerTest.splice(i, 1, ("matched" + i + "." + ii))
        masterCodeTest.splice(ii, 1, ("matched" + i + "." + ii))
      }
    }
  }

  for (i=0; i<blackPegs; i++) {
    results.push("black");
  }

  for (i=0; i<whitePegs; i++) {
    results.push("white");
  }

  displayResults(results);

  if (blackPegs == 4) {
    gameOver("win");
  }








// 5. if FALSE and if LEVEL < 10 add level++ and enableButtons(level)



// 6. if false and if level == 10 the GAME OVER() / WINNER = FALSE







}













// ************************************************************************
// ************ REMOVE OLD GUESS / ACTIVATE NEW GUESS ROW *****************
// ************************************************************************

function displayMasterCode() {
  $("#code_a").removeClass(colorChoices).addClass(masterCode[0]);
  $("#code_b").removeClass(colorChoices).addClass(masterCode[1]);
  $("#code_c").removeClass(colorChoices).addClass(masterCode[2]);
  $("#code_d").removeClass(colorChoices).addClass(masterCode[3]);
}











// ************************************************************************
// **************** REMOVE OLD RESULTS / DISPLAY NEW RESULTS **************
// ************************************************************************

function displayResults(results) {
  $("#result_" + (level - 1) + "_1").addClass(results[0]);
  $("#result_" + (level - 1) + "_2").addClass(results[1]);
  $("#result_" + (level - 1) + "_3").addClass(results[2]);
  $("#result_" + (level - 1) + "_4").addClass(results[3]);
}












// ************************************************************************
// *********************** DISABLE OLD BUTTONS ****************************
// ************************************************************************

function disableOldButtons(level) {
  $(".level_" + level).unbind();
}










// ************************************************************************
// *************************** GAME OVER **********************************
// ************************************************************************

function gameOver(result) {
  if (result == "win") {
    $("body").addClass("win");

    $(".winner").text("Winner! Winner!")

  } 

  if (result == "lose") {
    $("body").addClass("lose");

    $(".winner").text("You Lose!")

 
  }
    $(".digit").show();
    $(".restart").text("Press Any Key to Restart!")

    setTimeout(function () {
      $("body").removeClass("lose");
      $("body").removeClass("win");
    }, 400);


  

  
    for (i=10; i>=level; i--) {
      $(".level_" + i).addClass("btn_gone");
    }
    highlightLevel(level-1);


    level = 0;
    started = false;
 
  
}









// ************************************************************************
// ************************* HIGHLIGHT LEVEL ******************************
// ************************************************************************

function highlightLevel(level) {
  $("#turn_" + (level-1)).addClass("completed");


  $("#turn_" + level).addClass("current");

}














// ************************************************************************
// ************************* RESET BAORD  *********************************
// ************************************************************************

function resetBoard() {
  $(".result").removeClass("white").removeClass("black");

  for (i=0; i<6; i++) {
    $(".guess").removeClass(colorChoices[i]);
  }

  $(".guess").removeClass("btn_gone").addClass("gray");

  $(".guess").attr("color", "gray");

  $(".turn_ident").removeClass("completed").removeClass("current");

  masterCode=[];


}