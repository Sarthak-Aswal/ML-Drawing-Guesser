const userName=document.getElementById("inputBox");
const startButton=document.getElementById("startButton");
const inputForm=document.getElementById("inputForm");
const welcomeMessage=document.getElementById("welcomeMessage");
const sketchContainer=document.getElementById("sketchContainer");
startButton.addEventListener("click",startGame);
function startGame(){
    let user=userName.value;
    if(!user){
        alert("Enter a username!!");
        return;
    }
    else{
    inputForm.style.display="none";
    let message="Hi "+user+", please start drawing";
    welcomeMessage.textContent=message;
    sketchContainer.style.display="block";

    }

}
