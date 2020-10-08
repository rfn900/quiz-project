class Card{
    constructor(cardData = {}, i=0){
        this.card_id = i+1
        this.question = cardData.question
        this.answers = cardData.answers
        this.category = cardData.tags[0].name
        this.right_answer = this.rightAnswers(cardData.correct_answers) 
        this.isMultipleRightAnswers = cardData.multiple_correct_answers
        this.top_card = 1
        
    }

    printCardOnScreen(numberOfQuestions){
        let cardsContainer = document.getElementById("container")
        cardsContainer.classList.add("container")

        //Start by appending a question card to the container Div
        let cardDiv = document.createElement("div")
        cardDiv.id = "card-"+(this.card_id)
        cardDiv.classList.add("card")
        cardDiv.classList.add("card-"+this.card_id)
        cardsContainer.appendChild(cardDiv)

        let sheet = document.createElement('style')
        sheet.innerHTML += ".card-"+this.card_id+" {z-index: "+ (11-this.card_id) +";}";
        document.body.appendChild(sheet);
        
        //Append the Question Header to the card
        let h2 = document.createElement("h2")
        h2.innerHTML = "Question "+(this.card_id)+" of "+numberOfQuestions
        cardDiv.appendChild(h2)

        //Proceed by appending a Div that will contain the Question to the card
        let div_question = document.createElement("div")
        div_question.id = "title-question-"+(this.card_id)
        div_question.classList.add("question")
        cardDiv.appendChild(div_question)

        //Now append a Div that will contain the answer options to the card
        let div_answers = document.createElement("div")
        div_answers.id = "answer-options-"+(this.card_id)
        div_answers.classList.add("answer-options")
        cardDiv.appendChild(div_answers)

        //Append the actual question to the corresponding question Div
        let h3 = document.createElement("h3")
        h3.innerHTML = this.question 
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
        confirmAnswerBtn.setAttribute("disabled", "true")

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
                checkbox.classList.add("checkbox")
                let label = document.createElement("label")
                label.className = "container"
                let span = document.createElement("span")
                span.className = "checkmark"
                span.classList.add("checkmark_card_"+this.card_id)
                tempDiv.appendChild(checkbox)
                tempDiv.appendChild(span)
                label.id = "option-"+this.card_id+"-"+checkboxIdArray[index]
                label.classList.add("option-item")
                label.innerHTML = tempDiv.innerHTML
                label.innerHTML += answer.slice(-1)+") "
                label.innerHTML += this.htmlEscape(this.answers[answer])
                div_answers.appendChild(label)
            }
        })

        this.toggleBetweenCards(numberOfQuestions)
    }

    toggleBetweenCards(numberOfQuestions){
        let rightArrow = document.getElementById("right-arrow")
        let leftArrow = document.getElementById("left-arrow")

        rightArrow.addEventListener("click", () => {

            let index = this.top_card % numberOfQuestions
            
            //Clean all the cards from the special high z-index class 'card-1'
            Array.from(document.getElementsByClassName("card"))
            .forEach(element=>{
                element.classList.remove("card-1")
            })

            //Start by adding the class with the highest index to the next card in the list
            let nextCard = document.getElementById("card-"+(index+1))
            nextCard.classList.add("card-1")

            //Identify the card on top at every iteration
            let topCard = Array.from(document.getElementsByClassName("card-"+1))[0]
            this.top_card = topCard.id.split("-")[1]

            //Clean the next card of its original class
            if (index != 0) {
                nextCard.classList.remove("card-"+(index+1))   
            }
            
        })

        leftArrow.addEventListener("click", () => {
            
            //Clean all the cards from the special high z-index class 'card-1'            
            Array.from(document.getElementsByClassName("card"))
            .forEach((element, index)=>{
                element.classList.remove("card-1")
                element.classList.remove("card-"+(index+1))
            })

            //If the top card is the 1st card and we press left, We set the last card to be next on queue
            let nextCard
            if (this.top_card == 1){
                nextCard = document.getElementById("card-"+numberOfQuestions)
                nextCard.classList.remove("card-"+numberOfQuestions)    
            }
            else nextCard = document.getElementById("card-"+(this.top_card-1)) //Otherwise just put the card before it

            nextCard.classList.add("card-1")

            let topCard = Array.from(document.getElementsByClassName("card-"+1))[0]
            this.top_card = topCard.id.split("-")[1]
            
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
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/!/g, '&excl;')
    }
}
