"use strict";

//----------------------------------------------------------------------------------------------------------------------------------------
    //Defining the variables
//----------------------------------------------------------------------------------------------------------------------------------------    


// Creating an object called sequence to store all the values related to sequence
var sequence ={
    currentSequence : [],                       // Array to store the current sequence
    tempSequence : [],                          // Array to store the current sequence entered by the user
    lengthOfSequence : 4,                       // Variable to store the length of the array (**default value is set to 4**)
    tempLengthOfSequence : 0,                   // Variable to store the temporary length of the sequence
}


// Creating an object called level to store all the values related to level
var level ={
    currentLevel : 1,                           // Variable to store the current level the player is in
    currentCorrect : 0,                         // Variable to store the amount of sequences the player got right in the current level
    concecutiveCorrect : 2,                     // Variable to store the amount of correct sequences needed for the player to level up
    currentErrors : 0,                          // Variable to store the amount of wrong sequences the player made in the currrent level
}


// Creating an object called gameplayMode to store all the values realted to gameplay mode
var gameplayMode ={
    currentMode : "TOUCH_MODE",                 // Variable to store the gameplay mode the player is playing in 
    currentTILT : [],                           // Variable to store the beta and gamma values sent by deviceMotion callback function
                                                // currentTILT [0] = beta values ,  currentTILT [1] = gamma values
    
}


//----------------------------------------------------------------------------------------------------------------------------------------
    //Functions provided by Monash
//---------------------------------------------------------------------------------------------------------------------------------------- 

/*
 * This callback function will be called when any of the game buttons on the
 * screen is clicked on by the user (note that the user will not be able to
 * 'double-click' buttons, they will only be clickable once a button has
 * gone dark again)
 *
 * This function has a single parameter 'whichButton' that can take the
 * following values:
 *    "blue"
 *    "green"
 *    "yellow"
 *     "red"
*/
function buttonSelected(whichButton)
{
    
    // Getting the user button and saving it to the tempSequence array (** The name of the button is passed through the argument **)
    sequence.tempSequence[sequence.tempSequence.length]= whichButton;
    
    // After the button is added, substracting one from the tempLengthSequence
    sequence.tempLengthOfSequence--;
    
    // Updating the output using the updateOutput() function
    updateOutput();
        
    // Cheking whether the length of the temporary sequence is zero
    if (sequence.tempLengthOfSequence===0){
        // Declaring a local variable called equality
        var equality = false;
        // Comparing the temperory sequence with the correct current sequence
        for (var i=0; i<sequence.tempSequence.length;i++){
            //  Checking whether all the user inputs are correct
            if (sequence.tempSequence[i] === sequence.currentSequence[i]){
                // If correct equlaity is true
                equality=true;
            }else{
                // If wrong equality is false
                equality=false;
                // The program breaks out of the for loop since if one is wrong the user input is wrong
                break;
                
            }
            
        }
        
        // Check whether the equality is true 
        if (equality===true){
            // If the user has entered a correct sequence;
            // The current errors variable becomes zero
            level.currentErrors=0;
            // The current correct variable is increased by one
            level.currentCorrect++;
            // The show success function is called to show the green tick
            showSuccess();
            // The temporary Sequence array will be reseted to empty array
            sequence.tempSequence=[];
            // Updating the output using the updateOutput() function
            updateOutput("Correct");
            // Checking whether the user is ready to level up
            if (level.concecutiveCorrect===level.currentCorrect){
                // If the user has entered the correct amount of sequences;
                // Execute the increase level function to increase the level of the game
                increaseLevel();
                // Checking whether the user is ready to level up
                updateOutput("Correct");
                
            }
            
        }else{
            // If the user entred an incorrect sequence;
            // The show faliure function is executed to show the red cross on the display
            showFailure();
            // The number of Error the user entered in this level is increased by one
            level.currentErrors++;
            // The temporary Sequence array will be reseted to empty array
            sequence.tempSequence=[];
            // Updating the output using the updateOutput() function
            updateOutput("Incorrect");
            // Checking how many wrong sequences in a row the user has entered
            if(level.currentErrors===1){
                // If it is the first error
                if (sequence.lengthOfSequence===4){
                    // If the player has entered a wrong sequence in the first level
                    // Reset the game to the start of the same level (** That is Level 1 **)
                    resetLevel();
                    // Updating the output using the updateOutput() function
                    updateOutput("Incorrect");
                }else{
                    // If the user has entered wrong sequence in a level greater than Level 1 he will be taken
                    // to the start of the previous level
                    // Executing the decreaseLevel function
                    decreaseLevel();
                    // Updating the output using the updateOutput() function
                    updateOutput("Incorrect");
                }
            }else if(level.currentErrors===2){
                // If the player has entered two cocncetutive errors;
                // Reset the player to the start of the game (** That is Level 1**)
                resetLevel();
                // Updating the output using the updateOutput() function
                updateOutput("Incorrect");
            }
            
            }
        
    }
    
}
    

    
    
/*
 * This callback function will be called regularly by the main.js page.
 * It is called when it is time for a new sequence to display to the user.
 * You should return a list of strings, from the following possible strings:
 *    "blue"
 *    "green"
 *    "yellow"
 *    "red"
*/
function giveNextSequence()
{
    // Updating the output using the updateOutput() function
    updateOutput();
        
    // Display the Toast Message to ask the user to Watch the Sequence
    displayToastMessage("Watch the Sequence", 1000);
    
    // Execute the generateSequence function to generate the next sequence
    generateSequence();
    
    // Return the next sequence
    return sequence.currentSequence;
}


/*
 * This callback function is called when the sequence to display to the user
 * has finished displaying and user is now able to click buttons again.
*/
function sequenceHasDisplayed()
{
    //Update the output after the sequence has displayed
    updateOutput()
    
    // Checking whether the gameplay mode is TILT_MODE or TOUCH_MODE
    if (gameplayMode.currentMode==="TOUCH_MODE"){
        // Display the Toast Message to ask the user to Enter the Sequence
        displayToastMessage("Touch the Colours in Order to Enter the Sequence", 2000);
    }else if (gameplayMode.currentMode==="TILT_MODE"){
        // Display the Toast Message to ask the user to Enter the Sequence
        displayToastMessage("TILT the Phone to the Direction of the Colours to Enter the Sequence", 8000);
    }
    
}

/*
 * This callback function will be called if the user takes too long to make
 * a choice.  You can generally treat a call to this function as meaning the
 * user has 'given up'. This should be counted as an incorrect sequence given
 * by the user.
 *
 * When the app is is "tilt" input mode (see Step 7) then you might instead
 * use this function to select the button that the phone is tilted towards,
 * by calling one of the following functions:
 *    selectYellowButton
 *    selectRedButton
 *    selectBlueButton
 *    selectGreenButton
*/
function userChoiceTimeout()
{
    if (gameplayMode.currentMode==="TOUCH_MODE"){
        // If the user has selceted the current mode to TOUCH_MODE;
        // The show faliure function is executed because the user timed out therefore 
        // to show the red cross on the display
        showFailure();
        
        if (sequence.lengthOfSequence===4){
                    // If the user is in first level reset the game 
                    resetLevel();
                    // Updating the output using the updateOutput() function
                    updateOutput("Timed Out");
        }else{
            // If the user has entered wrong sequence in a level greater than Level 1 he will be taken
            // to the start of the previous level
            // Executing the decreaseLevel function
            decreaseLevel();
            // Updating the output using the updateOutput() function
            updateOutput("Timed Out");
        }
        // Reset the temporary sequence to an empty array
        sequence.tempSequence=[];
        // Reset the generate sequence to an empty array
        sequence.currentSequence=[];
        // Update users turn to false so that the user cannot enter any inputs
        usersTurn=false;
    }else if (gameplayMode.currentMode=="TILT_MODE"){
        // If the user is using TILT_MODE;
        // Using the timeout funtion to get the user input
        // Using beta and gamma values to determine the orientation of the device
        if (gameplayMode.currentTILT[0]< -5 & gameplayMode.currentTILT[1]< -8){
             selectBlueButton();
        }else if(gameplayMode.currentTILT[0]<-5 & gameplayMode.currentTILT[1] > 10){
             selectGreenButton();
        }else if(gameplayMode.currentTILT[0]>8 & gameplayMode.currentTILT[1]<-3){
             selectYellowButton();
        }else if(gameplayMode.currentTILT[0]>8 & gameplayMode.currentTILT[1]>5){
             selectRedButton();
        }else if(gameplayMode.currentTILT[0]>-5 & gameplayMode.currentTILT[0]<8 & gameplayMode.currentTILT[1]>-3 & gameplayMode.currentTILT[0]<5 ) {
             // If the device is lying flat, using an alert window to notify the user
             alert("Phone is Lying Flat. Please Press Okay and Try Again.");
             
         }else if(isNaN(gameplayMode.currentTILT[0]) & isNaN(gameplayMode.currentTILT[1])){
             // If the deviceMotion is detecting a motion event but the event is not providing the sensor information
             // then, notify then user that the Device Is Not Supported.
             alert("Oops. Looks Like Your Device does not support TILT Mode. Please Switch to Touch Mode.");
         }

         
    }
}

/*
 * This callback function will be called when the user taps the button at the
 * top-right of the title bar to toggle between touch- and tilt-based input.
 *
 * The mode parameter will be set to the newly selected mode, one of:
 *    TOUCH_MODE
 *    TILT_MODE
*/
function changeMode(mode)
{
    if (mode==2){
        // Changing the user input mode
        // Switching the current mode to TILT_MODE
        gameplayMode.currentMode = "TILT_MODE";
    }else if(mode==1){
        // Switching the current mode to TOUCH_MODE
        gameplayMode.currentMode = "TOUCH_MODE";
    }
    
    // If the device is in TILT_MODE firing the Device Motion Event
    if (gameplayMode.currentMode == "TILT_MODE"){
        // Checking whether the device motion even is supported
        if (window.DeviceMotionEvent){
            // If it is suppoted, calling the deviceMotion() user defined function
            deviceMotion("devicemotion");

        }else{
            // If it is not supported, alert the user.
            alert("TILT MODE is not SUPPORTED");
        }
        
            
    }
}

/*
 * This callback function will use the Device Motion event to calculate the Beta value and save it in the
 * currentTILT array in the 0th index.
*/
function betaFromDeviceMotionEvent(deviceMotionEvent)
{
    const RAD_TO_DEG = 180 / Math.PI;
    var aY = deviceMotionEvent.accelerationIncludingGravity.y;
    var aZ = deviceMotionEvent.accelerationIncludingGravity.z;
    var gY = aY / 9.8;
    var gZ = aZ / 9.8;
    var pitch = Math.atan(-gY / gZ) * RAD_TO_DEG;
    var beta = -1 * pitch;
    beta = Math.round(beta*100)/100;
    
    // Updating the currentTILT[0] everytime a change in orientation is made
    gameplayMode.currentTILT[0] = beta;
}

/*
 * This callback function will use the Device Motion event to calculate the Gamma value and save it in the
 * currentTILT array in the 1st index.
*/
function gammaFromDeviceMotionEvent(deviceMotionEvent)
{
    const RAD_TO_DEG = 180 / Math.PI;                          
    var aX = deviceMotionEvent.accelerationIncludingGravity.x;
    var aZ = deviceMotionEvent.accelerationIncludingGravity.z;
    var gX = aX / 9.8;
    var gZ = aZ / 9.8;
    var pitch = Math.atan(-gX / gZ) * RAD_TO_DEG;
    var gamma = pitch
    gamma = Math.round(gamma*100)/100;
    
    // Updating the currentTILT[1] everytime a change in orientation is made
    gameplayMode.currentTILT[1] = gamma;
}
 
   

//--------------------------------------------------------------------
    //Functions which were defined by our team
//--------------------------------------------------------------------    

/*
 * This callback function will be used to increase the level of the game to the next level
*/

function increaseLevel()
{
    // Increase the amount of correct sequences needed to level up (** If Level One is 4, Level 2 is 5 **)
    level.concecutiveCorrect++;
    // Reset the currentCorrect to zero
    level.currentCorrect=0;
    // Increasing the length of the sequence by one
    sequence.lengthOfSequence++;
    // Increase the current level counter by one
    level.currentLevel++;
    
    
      
}

/*
 * This callback function will be used to reset the level of the game to the previous level
 *
 * This resets the correct counter and reduce the level by one
*/

function decreaseLevel()
{
    // Reduce the length of the sequence by one
    sequence.lengthOfSequence--;
    // Reduce the amount of correct sequences to level up by one
    level.concecutiveCorrect--;
    // Reset the current Sequence array
    sequence.currentSequence=[];
    // Reset the current correct variable to zero
    level.currentCorrect=0;
    // Reduce the current level by one
    level.currentLevel--;
    
}

/*
 * This callback function will be used reset the game back to the starting point
*/

function resetLevel()
{
    // Reset the game to starting length of the sequence that is 4
    sequence.lengthOfSequence=4;
    // Reset the concecutiveCorrect varible to 2
    level.concecutiveCorrect=2;
    // Reset the current Sequence array
    sequence.currentSequence=[];
    // Reset the current correct variable to zero
    level.currentCorrect=0;
    // Reduce the current level to one
    level.currentLevel=1;
}

/*
 * This callback function will used to update the output to the user
 * This will be using the element with "output" ID to display the output
 *
 * This function takes in an argument as a string to output it if needed
 *
 *
 * We have used the MDL (material design lite) Cards to improve the quality of the output
 * 
*/


function updateOutput(aString){
    // Using getElementById to get the output element to a reference variable 
    var outputArea = document.getElementById("output");
    // Generating a blank string
    var output="";
    // If aString argument is defined
    if (aString!==undefined){
        // Print the string in the h2 tag
        output+="<h2 style=\" display : block; text-align:left; background-color:darkblue; color:#fff;margin-top:0px;padding-left:90px;\">"+aString+"</h2>"
    }else{
        // If no argument is provided the temporary length of the sequence is shown
        output += "<h2 style=\" display : block; text-align :left; background-color:darkblue; color:#fff;margin-top:0px;padding-left:165px;\">"+sequence.tempLengthOfSequence+"</h2>";
    }
    
    // Adding the current level to the output
    output += "<br><h1 style=\" display : block; text-align : left; background-color:darkblue; color:#fff; padding-left:100px\">Level " + level.currentLevel + "</h1><br>";
    
    
    // Adding the length of the sequence to the output
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Length of Sequence</h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\">"+sequence.lengthOfSequence+"</div></div><br><br>";
    
    // Adding the correct sequence in current level to the output 
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Correct Sequences in Current Level </h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\">"+level.currentCorrect+"</div></div><br><br>";
    
    // Adding the remaining sequences to level up to the output 
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Remaining Sequences to Level Up </h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\">"+(level.concecutiveCorrect-level.currentCorrect) +"</div></div><br><br>";
    
    // Updating the output tag
    outputArea.innerHTML= output;
}


/*
 * This callback function will used to generate the next sequence and will return a array of colours to be
 * displayed to the user
*/

function generateSequence(){

    // Creating an array with the four colours
    var colourArray = ["blue","green","yellow","red"];
    
    // Generating the return array
    for (var i=0; i<sequence.lengthOfSequence;i++){
        // Generating a Random Number between 0 and the length of the array
        sequence.currentSequence[i] = colourArray[Math.floor(Math.random()*colourArray.length)]; 
        
    }
   
    // Getting the temporary sequence length
    sequence.tempLengthOfSequence = sequence.lengthOfSequence;
    
    // Returning the current sequence
    return sequence.currentSequence;
     
}


/*
 * This callback function will be use to run both betaFromDeviceMotionEvent and gammaFromDeviceMotionEvent function while
 * passing an event as the parameter
*/
function deviceMotion(event){
    // Firing the two Device Motion events which are used to get the device Oreintation
    // Firing the event to get the gamma value
    window.addEventListener(event, gammaFromDeviceMotionEvent);
    // Firing the event to get the beta value
    window.addEventListener(event, betaFromDeviceMotionEvent);
}

/*
 * This  function will be executed when the page is laoded for the first time
*/
function firstLoad(){
    // Executes the updateOutputFirstLoad() function
    updateOutputFirstLoad();
}

function updateOutputFirstLoad(){
    // Using getElementById to get the output element to a reference variable 
    var outputArea = document.getElementById("output");
    // Generating a blank string
    var output="";
    
    // Printing the default slide
    output += "<h1 class=\"animated bounceInUp\" style=\" display : block; text-align : left;margin-top:0px; background-color:darkblue; color:#fff; padding-left:55px\" onclick=\"startGame();\">Press Start</h1><br><br><br>";
    
    // Printing the default slide
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp animated fadeInUp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Length of Sequence</h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\"></div></div><br><br>";
    
    // Printing the default slide
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp animated fadeInUp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Correct Sequences in Current Level </h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\"></div></div><br><br>";
    
    // Printing the default slide
    output +="<div class=\"demo-card-wide mdl-card mdl-shadow--2dp animated fadeInUp\" style=\"display:inline-block;margin-left:15px;height:80px\" ><div class=\"mdl-card__title\" style=\"background-color:darkblue;color:#fff; height:150px\"><h2 class=\"mdl-card__title-text\">Remaining Sequences to Level Up </h2></div><div class=\"mdl-card__supporting-text\" style=\"font-size:3em\"></div></div><br><br>";
    
    // Updating the output tag
    outputArea.innerHTML= output;
}
