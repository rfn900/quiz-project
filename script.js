window.addEventListener("DOMContentLoaded", ()=>{
    let btn = document.getElementById("submit-btn")
    let quiz = new Quiz
   
    btn.addEventListener("click", e => quiz.registerPlayer())

    
})