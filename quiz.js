class Player{
    constructor(name = "", i=1){
        this.id = i,
        this.name = name,
        this.points = this.calculatePoints()
    }
    calculatePoints(){
        return 1
    }
}

class Quiz{
    constructor(){
        this.numberOfQuestions = this.setNumberOfQuestions;

    }

    setNumberOfQuestions(){
        return 0
    }

    registerPlayer(){
        let nameInput = document.getElementById("name-input").value
        let startBox = document.getElementById("start_box")
        let startBoxBack = document.getElementById("start_box_back")
        startBox.classList.add("spin")
        startBoxBack.classList.add("pop_to_front")

        if (nameInput.length < 2){
            let div = document.createElement("div")
            div.classList.add("back_box_err")
            startBoxBack.appendChild(div)

            let i = document.createElement("i")
            i.classList.add("fa-thumbs-down")
            i.classList.add("fas")
            
            let h2 = document.createElement("h2")
            h2.innerHTML = "Wrong!"
            
            let p = document.createElement("p")
            p.innerHTML = "Your Name Must Contain at Least 2 Characters! <a href='/'>Try Again...</a>"
            
            div.appendChild(h2)
            div.appendChild(i)
            div.appendChild(p)
        }else{
            let div = document.createElement("div")
            div.classList.add("back_box_err")
            startBoxBack.appendChild(div)

            let i = document.createElement("i")
            i.classList.add("fa-thumbs-up")
            i.classList.add("fas")
            
            let h2 = document.createElement("h2")
            h2.innerHTML = "Good Luck, "+ nameInput + "!"
            
            let button = document.createElement("button")
            button.id = "start-quiz"
            button.classList.add("grab_name_button")
            button.innerHTML = "Start The Quiz!"
            
            div.appendChild(h2)
            div.appendChild(i)
            div.appendChild(button)

            let player = new Player(nameInput)
            console.log(player)
            this.displayQuestions()
        }
    }

    displayQuestions(){
        let startQuizBtn = document.getElementById("start-quiz")
        let startBox = document.getElementById("start_box")
        let startBoxBack = document.getElementById("start_box_back")
        
        startQuizBtn.addEventListener("click", ()=>{
            startBox.remove()
            startBoxBack.remove()
            let cardsContainer = document.getElementById("container")
            cardsContainer.classList.add("container")
            let main = document.getElementsByTagName("main")
            main[0].classList.add("stretch")

            let numberOfQuestions = 10
            let API_KEY = "7i21EngxshaQ6wp9IgJVwzkoidfOxGMVsg3j2ma5"
            let url = "https://quizapi.io/api/v1/questions?apiKey="
            url += API_KEY 
            url += "&limit="+numberOfQuestions
            fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach((cardData,iData)=>{
                    //Start by appending a question card to the container Div
                    let card = document.createElement("div")
                    card.id = "card-"+(iData+1)
                    card.classList.add("card")
                    cardsContainer.appendChild(card)

                    //Append the Question Header to the card
                    let h2 = document.createElement("h2")
                    h2.innerHTML = "Question "+(iData+1)
                    card.appendChild(h2)

                    //Proceed by appending a Div that will contain the Question to the card
                    let div_question = document.createElement("div")
                    div_question.id = "title-question-"+(iData+1)
                    div_question.classList.add("question")
                    card.appendChild(div_question)

                    //Now append a Div that will contain the answer options to the card
                    let div_answers = document.createElement("div")
                    div_answers.id = "answer-options"+(iData+1)
                    div_answers.classList.add("answer-options")
                    card.appendChild(div_answers)

                    //Append the actual question to the corresponding question Div
                    let h3 = document.createElement("h3")
                    h3.innerHTML = cardData.question //cardData is the Object read from the API
                    div_question.appendChild(h3)
                    
                    let span = document.createElement("span")
                    console.log(cardData.tags[0].name)
                    span.innerHTML = cardData.tags[0].name
                    span.classList.add("category")
                    card.appendChild(span)

                    let answers = cardData.answers
                    //Now append a set of Divs to the answers Div
                    Object.keys(answers).forEach(answer=>{  //Will loop through all object values "answer"
                        if(answers[answer] !== null){
                            let div = document.createElement("div")
                            div.classList.add("option-item")
                            div.innerHTML = answer.slice(-1)+") "
                            div.innerHTML += this.htmlEscape(answers[answer])
                            div_answers.appendChild(div)
                        }
                    })
                })
            }) 
                

        })
      
    }

    htmlEscape(str){
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
}