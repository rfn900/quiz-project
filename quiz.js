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

class Card{
    constructor(cardData = {}, i=0){
        this.card_id = i+1
        this.question = cardData.question
        this.answers = cardData.answers
        this.category = cardData.tags[0].name
        this.right_answer = this.rightAnswers(cardData.correct_answers) 
        this.isMultipleRightAnswers = cardData.multiple_correct_answers
        
    }

    printCardOnScreen(){
        let cardsContainer = document.getElementById("container")
        cardsContainer.classList.add("container")

        //Start by appending a question card to the container Div
        let cardDiv = document.createElement("div")
        cardDiv.id = "card-"+(this.card_id)
        cardDiv.classList.add("card")
        cardsContainer.appendChild(cardDiv)

        //Append the Question Header to the card
        let h2 = document.createElement("h2")
        h2.innerHTML = "Question "+(this.card_id)
        cardDiv.appendChild(h2)

        //Proceed by appending a Div that will contain the Question to the card
        let div_question = document.createElement("div")
        div_question.id = "title-question-"+(this.card_id)
        div_question.classList.add("question")
        cardDiv.appendChild(div_question)

        //Now append a Div that will contain the answer options to the card
        let div_answers = document.createElement("div")
        div_answers.id = "answer-options"+(this.card_id)
        div_answers.classList.add("answer-options")
        cardDiv.appendChild(div_answers)

        //Append the actual question to the corresponding question Div
        let h3 = document.createElement("h3")
        h3.innerHTML = this.question //cardData is the Object read from the API
        div_question.appendChild(h3)
        
        let span = document.createElement("span")
        span.innerHTML = this.category
        span.classList.add("category")
        cardDiv.appendChild(span)

        let confirmAnswerBtn = document.createElement("button")
        confirmAnswerBtn.innerHTML = "Confirm Your Answer"
        confirmAnswerBtn.classList.add("grab_name_button")
        confirmAnswerBtn.classList.add("confirm_button")
        confirmAnswerBtn.id = "confirm-"+this.card_id
        cardDiv.appendChild(confirmAnswerBtn)


        let checkboxIdArray = ["a","b","c","d","e","f","g"]
        //Now append a set of Divs to the answers Div
        Object.keys(this.answers).forEach((answer,index)=>{  //Will loop through all object values "answer"
            if(this.answers[answer] !== null){
                let div = document.createElement("div")
                let tempDiv = document.createElement("div") //Create a temporary div just so I can call its innerHTML (checkbox)
                let checkbox = document.createElement("input")
                checkbox.setAttribute("type", "checkbox")
                checkbox.id = "checkbox-"+checkboxIdArray[index]
                checkbox.classList.add("checkbox_card_"+this.card_id)
                tempDiv.appendChild(checkbox)
                div.classList.add("option-item")
                div.innerHTML = tempDiv.innerHTML
                div.innerHTML += answer.slice(-1)+") "
                div.innerHTML += this.htmlEscape(this.answers[answer])
                div_answers.appendChild(div)
            }
        })
    }

    rightAnswers(correctAnswers){
        let right = []
        Object.keys(correctAnswers).forEach(index=>{
            
            if(correctAnswers[index] == "true"){   
                
                right.push(index.split("_")[1])
            }

        })
        return right;
    }

    htmlEscape(str){
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
}

class Quiz{
    constructor(){
        this.numberOfQuestions = this.setNumberOfQuestions;
        this.cards = [];
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
            let main = document.getElementsByTagName("main")
            main[0].classList.add("stretch")

            let numberOfQuestions = 10
            let API_KEY = "7i21EngxshaQ6wp9IgJVwzkoidfOxGMVsg3j2ma5"
            let url = "https://quizapi.io/api/v1/questions?apiKey="
            url += API_KEY 
            url += "&limit="+numberOfQuestions
            let card = {}
             fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach((cardData,iData)=>{
                    card = new Card(cardData, iData)
                    card.printCardOnScreen();
                    this.cards.push(card)
                    this.checkPlayersAnswer(card,iData)
                })   
            }) 
            


        })
    }

    checkPlayersAnswer(card,i){
        let confirmBtn = document.getElementById("confirm-"+(i+1))
        let cardDiv = document.getElementById("card-"+(i+1))
        let array = []
        confirmBtn.addEventListener("click",(e)=>{
            let clicked_card = e.target.id.split("-")[1]
            let checkbox = Array.from(document.getElementsByClassName("checkbox_card_"+clicked_card))
            
            let markedCheckboxes = checkbox.filter(box => box.checked === true).map(element=>element.id.split("-")[1]);
            
            //The answer will only be correct if the user chooses all the correct answers!
            let isAnswerCorrect = Array.isArray(markedCheckboxes) &&
            Array.isArray(card.right_answer) &&
            markedCheckboxes.length === card.right_answer.length &&
            markedCheckboxes.every((val, index) => val === card.right_answer[index]);

            console.log(markedCheckboxes,card.right_answer)
            if (isAnswerCorrect){
                cardDiv.classList.add("write-answer")
            }else {
                cardDiv.classList.add("wrong-answer")
            }
            checkbox.map(chck => chck.remove())
            confirmBtn.setAttribute("disabled", "true")
            //confirmBtn.classList.add("btn-disabled")
            confirmBtn.remove()
        })

        
    }
}