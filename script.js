window.addEventListener("DOMContentLoaded", ()=>{
    let btn = document.getElementById("submit-btn")
    let quiz = new Quiz
   
    //When the user clicks the submit button, the player is registered
    //and the Quiz game is initialized
    btn.addEventListener("click", e => quiz.registerPlayer())

    
})