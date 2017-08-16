function isOperator(val){
  switch(val){
    case '+':
    case '-':
    case '/':
    case '*':
      return true;
    default: return false;
            }
}
function findDot(ele){
  return ele === '.';
}
function evalOperator(val1,op,val2){
  switch(op){
    case '+': //console.log("SUM: "+(val1+val2));
      return val1+val2;
      break;
    case '-':  return val2-val1;
      break;
    case '/':  return val2/val1;
      break;
    case '*':  return val1*val2;
      break;
    default:return val1;
           }
}

function keyboardOps(k){
  console.log("Case "+k);
  switch(k){
    case 8: $("#bksp").click();
      break;
    case 42: $("#mul").click();
      break;
    case 43: $("#add").click();
      break;
    case 45: $("#sub").click();
      break;
    case 46: $("#dot").click();
      break;
    case 47: $("#div").click();
      break;
    case 48: $("#zero").click();
      break;
    case 49: $("#one").click();
      break;
    case 50: $("#two").click();
      break;
    case 51: $("#three").click();
      break;
    case 52: $("#four").click();
      break;
    case 53: $("#five").click();
      break;
    case 54: $("#six").click();
      break;
    case 55: $("#seven").click();
      break;
    case 56: $("#eight").click();
      break;
    case 57: $("#nine").click();
      break;
    case 13: $("#eq").click();
      break;
    case 61: $("#eq").click();
      break;
    default: console.log("Unknown Key");
  }
}
$(document).ready(function(){

  //KeyBoard Event Calls
  $(document).keypress(function(e) {
    //console.log(e.keyCode);
    keyboardOps(e.keyCode);
});


  var opSafe = false; //Do not allow multiple operator
  var displayStack = []; //Main Display Adapter for Calculator
  var subDisplay =[];
  var numStack = [0]; //Complete Number array
  var opStack = []; // Store operators
  var wholeNum = []; // Build Single Digit
  var dotSafe = true; // Flag to prevent multiple decimal
  var chkEq = false; // Flag to prevent multiple equal
  var numLock = false; // Prevent Directly entering Number into input Screen

  displayStack = [0]; //Clearing DisplayStack (For maintaining a zero by default)
  $("#sub-display").html("&nbsp;");

  $("button").on('click',function(){
    var val = $( this ).text();

    if(val === '.'){ // Check for multiple decimals
      //opSafe = true;
      //console.log(countDot);
      // TODO Direct Press Dot Button over a result
      // TODO Dot button over operator
      if(wholeNum.length < 1 && opStack <1){ // If dot is pressed after equal, clear the displayStack
        displayStack = [];
      }
      //numLock=false;
      if(dotSafe){
        displayStack.push(val);
        wholeNum.push(val);
        dotSafe = false; // Prevent Multiple Dots together
      }

    }if(val === '←⸺'){
      console.log("BackSpace");
      if(displayStack.length>1 || displayStack[displayStack.length-1]!==0){
        poppedVal = displayStack.pop();
        //console.log(wholeNum);
        if(wholeNum.length > 0 ){
          wholeNum.pop();
        }else if( $.isNumeric(poppedVal) && (numStack.length > 0)){
          numStack.pop();
          if(numStack.length<1){
            displayStack[0]=0;
          }
          console.log("number removed from NumStack");
        }else if( isOperator(poppedVal) && (opStack.length > 0)){
          opStack.pop();
          console.log("Operator removed");
        }else{

          console.log("No More sub-elements to remove");
        }
      }else{
          displayStack[0]=0;
          console.log("No More elements to remove");
      }
    }else if( $.isNumeric(val) ){ // Check if input is a number & add to input stack
      if(numLock){
        displayStack = [];

      }
      //console.log($("#main-display").html());
      if(parseFloat($("#main-display").html()) === 0 && !(wholeNum.find(findDot) === '.')){  //check this true later for dot press
        console.log("DispClear");
        displayStack = [];
        $("#main-display").html("&nbsp;");
      }
      // TODO Put a Clear stack if directly a number is called.
      console.log(displayStack.length);
      if(displayStack[displayStack.length-1] === undefined){
        numStack = [];
      }
      displayStack.push(val);
      opSafe = true;
      wholeNum.push(parseFloat(val));
      console.log("yes -num press");
      chkEq = false;
      numLock = false;
    }else if( isOperator(val) ){ // Check if input is a operator and push it to operator stack
      //console.log(wholeNum.join());
      if(opSafe){
        displayStack.push(val);
        if(chkEq){ //To get value from Stack when already an operation is performed earlier using equal

        }else
        {
          //console.log(wholeNum.join(""));
          numStack.push(parseFloat(wholeNum.join("")));
          wholeNum = [];
        }

        opStack.push(val);
        opSafe = false;
        dotSafe = true; //Allow dot after operator
      }else{
        if(displayStack.length>0){
          displayStack.pop();
          opStack.pop();
          displayStack.push(val);
          opStack.push(val);
        }
        console.log("Unsafe State");
      }
      numLock = false;
    }else if( val === 'C' ){ // Clear all memory and reset the Calculator
      numStack = [];
      opStack = [];
      wholeNum = [];
      displayStack = [0]; //Clearing DisplayStack
      subDisplay = [];
      dotSafe = true;
      $("#sub-display").html("&nbsp;");
      console.log('Clear All');
    }else if( val === '=' ){ // Perform Evalulation using =
      if(wholeNum[wholeNum.length-1] === '.'){ // Dont allow  equal after .
        return;
      }
      if(isOperator(displayStack[displayStack.length-1])){
        console.log("Operator Found! without Value.");
        opStack.pop();
        displayStack.pop();
        subDisplay.pop();
        opSafe = true;
      //  return;
      } //need update
      if(numStack.length>0||wholeNum.length>0){

        if(wholeNum.length>0){
          console.log(wholeNum.join(""));
          numStack.push(parseFloat(wholeNum.join(""))); //Complete the Stack
          wholeNum=[];
        }

        if(numStack.length>1){
          result = evalOperator(numStack.pop(),opStack.pop(),numStack.pop()); // Pop two values and Operate
        }else{
          result = numStack.pop(); //Display if single number in memory
        }
        numStack.push(result);
        //opSafe = false;

        chkEq = true;
        dotSafe = true;
        numLock = true;

        while( numStack.length > 1 ){
          result = evalOperator(numStack.pop(),opStack.pop(),numStack.pop());
          numStack.push(result);
        }
      }else{
        numStack.push(0);
        result = 0;
      }
      subDisplay = displayStack;
      $("#sub-display").html(subDisplay);

      displayStack = [result];
      console.log("RESULT: "+result);
    }
    $("#main-display").html(displayStack);
    console.log("wholeNum = "+wholeNum+" :: numStack = "+numStack+" :: opStack = "+opStack+" :: displayStack = "+displayStack+" :: subDisplay = "+subDisplay);
    //console.log(val);
  });
});

//TO DO : After Equal if directly a number is pressed clear the mainDisplay and push the number
