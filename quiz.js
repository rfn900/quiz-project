class Player{
    constructor(name = ""){
        this.name = name,
        this.points = 0
    }
    printCurrentPoints(isRight, clicked_card_id){
        
        if (isRight){
            let icon = document.getElementById("point-icon-"+clicked_card_id)
            icon.classList.remove("not-answered")
            icon.classList.add("right-answer-icon")
            this.points+=10;
        }else {
            let icon = document.getElementById("point-icon-"+clicked_card_id)
            icon.classList.remove("not-answered")
            icon.classList.remove("fa-thumbs-up")
            icon.classList.add("fa-thumbs-down")
            icon.classList.add("wrong-answer-icon")
        }
        
        let p = document.getElementById("current-points")
        p.innerHTML = this.points
        
    }
    setPointsArea(numberOfQuestions){
        let footer = document.getElementById("footer")
        let div = document.createElement("div")
        div.id = "footer-points"
        div.classList.add("points-area")
        let p = document.createElement("p")
        p.innerHTML = ", Here Are Your Current Points:"
        let span = document.createElement("span")
        span.innerHTML = this.name
        div.appendChild(span)
        div.appendChild(p)
        for (let i=0; i<numberOfQuestions; i++){
            let icon = document.createElement("i")
            icon.id = "point-icon-"+(i+1)
            icon.classList.add("fa-thumbs-up")
            icon.classList.add("fas")
            icon.classList.add("not-answered")
            div.appendChild(icon)
        }
        let divP = document.createElement("div")
        let p2 = document.createElement("p")
        p2.innerHTML = this.points;
        p2.id = "current-points"
        p2.classList.add("points-span")
        divP.appendChild(p2)
        div.appendChild(divP)
        footer.appendChild(div)
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
        h2.innerHTML = "Question "+(this.card_id)
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
                tempDiv.appendChild(checkbox)
                div.id = "option-"+this.card_id+"-"+checkboxIdArray[index]
                div.classList.add("option-item")
                div.innerHTML = tempDiv.innerHTML
                div.innerHTML += answer.slice(-1)+") "
                div.innerHTML += this.htmlEscape(this.answers[answer])
                div_answers.appendChild(div)
            }
        })
        this.toggleBetweenCards(numberOfQuestions)
    }


    toggleBetweenCards(numberOfQuestions){
        let rightArrow = document.getElementById("right-arrow")
        let leftArrow = document.getElementById("left-arrow")

        rightArrow.addEventListener("click",()=>{

            let index = this.top_card % numberOfQuestions
            console.log(index, this.top_card, numberOfQuestions)
            //index < 0 ? index += 9 : index
            
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

        leftArrow.addEventListener("click", ()=>{
            
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
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
}

class Quiz{
    constructor(){
        this.numberOfQuestions = 1;
        this.cards = [];
        this.questionsAnswered = 0;
        this.numberOfRounds = 1;
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
            let player = new Player(nameInput)
            let div = document.createElement("div")
            div.classList.add("back_box_err")
            startBoxBack.appendChild(div)

            let i = document.createElement("i")
            i.classList.add("fa-thumbs-up")
            i.classList.add("fas")
            
            let h2 = document.createElement("h2")
            h2.innerHTML = "Good Luck, "+ player.name + "!"
                   
            div.appendChild(h2)
            div.appendChild(i)
            
            this.setNumberOfQuestions(div,player)
        }
    }

    setNumberOfQuestions(div, player){
        let button = document.createElement("button")
        button.id = "start-quiz"
        button.classList.add("grab_name_button")
        button.innerHTML = "Start The Quiz!"
        
        let inputDiv = document.createElement("div")
        let span = document.createElement("span")
        span.innerHTML = "How Many Quiz Cards?"
        let input = document.createElement("input")
        input.id = "number-of-cards-input"
        inputDiv.classList.add("for-number-input")
        input.setAttribute("type","number")
        input.setAttribute("min", "5")
        input.setAttribute("max", "10")
        input.setAttribute("value", "10")
        inputDiv.appendChild(span)
        inputDiv.appendChild(input)
        div.appendChild(inputDiv)
        div.appendChild(button)
        player.chosenNumberOfQuestions = this.numberOfQuestions;

        let startQuizBtn = document.getElementById("start-quiz")
            startQuizBtn.addEventListener("click", () =>{
                this.numberOfQuestions = input.value
                console.log("aqui", input.value)
                this.displayQuestions(player)
                
            })
        
    }

    async displayQuestions(player){
            let startBox = document.getElementById("start_box")
            let startBoxBack = document.getElementById("start_box_back")
            let footerPOints = document.getElementById("footer-points")
            if (this.numberOfRounds==1){
                startBox.remove()
                startBoxBack.remove()
                let main = document.getElementsByTagName("main")
                main[0].classList.add("stretch")                
            }else if (this.numberOfRounds>1) {
                footerPOints.remove()
                let game_summary = document.getElementById("game-summary")
                game_summary.remove()
            
            }
            console.log(this.numberOfRounds)
            player.setPointsArea(this.numberOfQuestions)
            

            let API_KEY = "7i21EngxshaQ6wp9IgJVwzkoidfOxGMVsg3j2ma5"
            let url = "https://quizapi.io/api/v1/questions?apiKey="
            url += API_KEY 
            url += "&limit="+this.numberOfQuestions
            let card = {}
            await fetch(url) 
            .then(response => response.json())
            .then(data => {
                data.forEach((cardData,iData)=>{
                   // console.log(data)
                    card = new Card(cardData, iData)
                    card.printCardOnScreen(this.numberOfQuestions);
                    this.cards.push(card)
                   
                })   
            }) 
            

            this.checkPlayersAnswer(player)
        
    }

    
    checkPlayersAnswer(player){
        //Will only enable the Confirm Button if checkbox is checked
        let allCheckboxes = Array.from(document.getElementsByClassName("checkbox"))
        let confirmBtn = Array.from(document.getElementsByClassName("confirm_button"))
        
        //Add an event listener to all checkboxes on event "change"
        allCheckboxes.forEach(chk=> {
            chk.addEventListener("change",(e)=>{
                let cardNumber = e.target.parentNode.id.split("-")[1]
                let cardCheckboxes = Array.from(document.getElementsByClassName("checkbox_card_"+cardNumber))
                //If any checkbox is checked then we will set the confirm button's disable attribute to "true"
                if (cardCheckboxes.map(cx => cx.checked).includes(true)){
                    
                    confirmBtn[cardNumber-1].removeAttribute("disabled")
                    
                }else confirmBtn[cardNumber-1].setAttribute("disabled", "true")                
            })
        })

        confirmBtn.forEach(btn => {

            btn.addEventListener("click",(e)=>{

                let clicked_card = e.target.id.split("-")[1]
                
                let checkbox = Array.from(document.getElementsByClassName("checkbox_card_"+clicked_card))
                let markedCheckboxes = checkbox.filter(box => box.checked === true).map(element=>element.id.split("-")[1]);
                
                this.correct(markedCheckboxes, this.cards[clicked_card-1], player)

                checkbox.map(chck => chck.remove())
                btn.setAttribute("disabled", "true")
                //confirmBtn.classList.add("btn-disabled")
                btn.remove()
             })
        })
    }
    correct(markedCheckboxes, card, player){
        let cardDiv = document.getElementById("card-"+(card.card_id))
        //console.log(card)
        //The answer will only be correct if the user chooses all the correct answers!
        let isAnswerCorrect = Array.isArray(markedCheckboxes) &&
        Array.isArray(card.right_answer) &&
        markedCheckboxes.length === card.right_answer.length &&
        markedCheckboxes.every((val, index) => val === card.right_answer[index]);

        //console.log(markedCheckboxes,card.right_answer)
        if (isAnswerCorrect){
            for (let rightAns of card.right_answer){
                let rightAnsDiv = document.getElementById("option-"+card.card_id+"-"+rightAns)
                rightAnsDiv.classList.add("user-right-answer")
            }
            cardDiv.classList.add("card-write-answer")
            player.printCurrentPoints(true,card.card_id)
            this.endOfTheQuizGame(player)

        }else {
            for (let rightAns of card.right_answer){
                let rightAnsDiv = document.getElementById("option-"+card.card_id+"-"+rightAns)
                console.log(card)
                rightAnsDiv.classList.add("right-answer")
            }
            for (let wrongAns of markedCheckboxes){
                let wrongAnsDiv = document.getElementById("option-"+card.card_id+"-"+wrongAns)
                wrongAnsDiv.classList.add("user-wrong-answer")
            }
            cardDiv.classList.add("card-wrong-answer")
            player.printCurrentPoints(false,card.card_id)
            this.endOfTheQuizGame(player)
        }
    }

    endOfTheQuizGame(player){
        
        this.questionsAnswered++
                
        if (this.questionsAnswered == this.numberOfQuestions){
            let main = document.getElementById("main")
            main.innerHTML = ""
            let div = document.createElement("div")
            div.id = "game-summary"
            let childDiv = document.createElement("div")
           
            // container.innerHTML = ""
            div.classList.add("game-summary-div")
            let h2 = document.createElement("h2")
            h2.innerHTML = player.name+", Your Total Score is: " + player.points
            childDiv.appendChild(h2)
            div.appendChild(childDiv)
            div.className = "restart"
            let restartBtn = document.createElement("button")
            restartBtn.id = "start-quiz"
            restartBtn.innerHTML = "Restart the Game"
            restartBtn.className = "grab_name_button_reset"
            
            let inputDiv = document.createElement("div")
            let span = document.createElement("span")
            span.innerHTML = "Wanna Play a New Game? How Many Quiz Cards?"
            let input = document.createElement("input")
            input.id = "number-of-cards-input"
            inputDiv.classList.add("for-number-input-reset")
            input.setAttribute("type","number")
            input.setAttribute("min", "5")
            input.setAttribute("max", "10")
            input.setAttribute("value", "10")
            inputDiv.appendChild(span)
            inputDiv.appendChild(input)

            let message = ''
            if (player.points < 70 && player.points > 40){
                message = '"You Are On the Right Track! Keep Studying"'
            }else if(player.points<40){
                message = '"Ya Dumb!"'
            }else if(player.points>70){
                message = '"You Are Basically a Pro! Respect."'
            }
            let divMessage = document.createElement("div")
            divMessage.className = "message"
            divMessage.innerHTML = message
            div.appendChild(divMessage)
            div.appendChild(inputDiv)
            div.appendChild(restartBtn)
            main.appendChild(div)


            restartBtn.addEventListener("click", e =>{
                this.numberOfQuestions = input.value
                this.resetTheGame(player)
                this.displayQuestions(player)
            })   
        }
        
        return -1
    }

    resetTheGame(player){
    

        this.cards = []
        player.points = 0
        this.numberOfRounds++
        this.questionsAnswered = 0;
        let main = document.getElementById("main")
        let container = document.createElement("div")
        container.id = "container"
        
        let right_arrow = document.createElement("div")
        let left_arrow = document.createElement("div")
        right_arrow.classList.add("arrow")
        left_arrow.classList.add("arrow")
        right_arrow.id = "right-arrow"
        left_arrow.id = "left-arrow"

        
        let iRight = document.createElement("i")
        let iLeft = document.createElement("i")
        iRight.classList.add("fa-chevron-circle-right")
        iRight.classList.add("fas")
        iLeft.classList.add("fa-chevron-circle-left")
        iLeft.classList.add("fas")
        right_arrow.appendChild(iRight)
        left_arrow.appendChild(iLeft)
        
        main.appendChild(left_arrow)
        main.appendChild(container)
        main.appendChild(right_arrow)
    }
}