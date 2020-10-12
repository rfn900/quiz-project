class Quiz{
    constructor(){
        this.numberOfQuestions = 1;
        this.cards = [];
        this.questionsAnswered = 0;
        this.numberOfRounds = 1;
        this.registerPlayer();
    }   

    registerPlayer(){
        //This method controls the player's name input and registers a new Player
        let nameInput = document.getElementById("name-input").value;
        let startBox = document.getElementById("start_box");
        let startBoxBack = document.getElementById("start_box_back")
        startBox.classList.add("spin") 
        startBoxBack.classList.add("pop_to_front");

        if (nameInput.length < 2 ){
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
            //Create an instance of the class Player if the user enters a valid player name
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
        //This method sets the number of questions in a give quiz game
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
        
        startQuizBtn.addEventListener("click", () => {
            let valueFromUser = input.value;
            this.controlNumberOfQuestions(player, valueFromUser, button, inputDiv)
        })
    }
        
    controlNumberOfQuestions(player, valueFromUser, button, inputDiv){
        //This method controls the number of questions and call the displayQuestion method
        let startBox = document.getElementById("start_box")
        let startBoxBack = document.getElementById("start_box_back")
        let footerPoints = document.getElementById("footer-points")
       
        if (this.numberOfRounds==1){
            startBox.remove()
            startBoxBack.remove()
            let main = document.getElementsByTagName("main")
            main[0].classList.add("stretch")                
        }else if (this.numberOfRounds>1) {
            footerPoints.remove()
        }
        inputDiv.id = "temp_message"
        let loader = document.createElement("div")
        loader.className = "loader"
        loader.id = "loader_id"
        let container =  document.getElementById("container")
        
        this.numberOfQuestions = valueFromUser

        if(this.numberOfQuestions >= 5 && this.numberOfQuestions <= 10){  

            this.displayQuestions(player)

          } else if (this.numberOfQuestions <= 5){
              button.remove()
              inputDiv.innerHTML = "Sorry. Number of Questions Must Be Between 5 and 10!"
              inputDiv.innerHTML += "<br />"
              inputDiv.innerHTML += "<br />"
              inputDiv.innerHTML += " Don't worry, we are setting the number of questions to 5! :)"
              inputDiv.classList.add("center-text")
              container.appendChild(inputDiv)
              container.appendChild(loader)
              container.classList.add("center-container")
              this.numberOfQuestions = 5
              setTimeout( () => {                    
                    this.displayQuestions(player)
                    inputDiv.remove()
                    loader.remove()
                }
                  , 3000);
          } else if (this.numberOfQuestions >= 10){
              button.remove()
              inputDiv.innerHTML = "Sorry! Number of Questions Must Be Between 5 and 10."
              inputDiv.innerHTML += "<br />"
              inputDiv.innerHTML += "<br />"
              inputDiv.innerHTML += " Don't worry, we are setting the number of questions to 10! :)"
              inputDiv.classList.add("center-text")
              container.appendChild(inputDiv)
              container.appendChild(loader)
              container.classList.add("center-container")
         
              this.numberOfQuestions = 10
              setTimeout( () => {                    
                this.displayQuestions(player)
                inputDiv.remove()
                loader.remove()
            }
              , 3000);
      }
                  
    }   

    async displayQuestions(player){
        //This is where we fetch and store the relevant data form the API
        //For each question, a new instance of the class Card is created
        //The property quiz.cards contains all Card objects for a specific quiz game
        player.setPointsArea(this.numberOfQuestions)

        let API_KEY = "7i21EngxshaQ6wp9IgJVwzkoidfOxGMVsg3j2ma5"
        let url = "https://quizapi.io/api/v1/questions?apiKey="
        url += API_KEY 
        url += "&limit="+this.numberOfQuestions

        const data = await (await fetch(url)).json() 

        data.forEach((cardData,iData)=>{
            let card = new Card(cardData, iData)
            card.printCardOnScreen(this.numberOfQuestions);
            this.cards.push(card)            
        })   
        
        //Now we are ready to start listening to the player's answers
        this.checkPlayersAnswer(player)
    
    }
    
    checkPlayersAnswer(player){
        //Will only enable the Confirm Button if checkbox is checked
        let allCheckboxes = Array.from(document.getElementsByClassName("checkbox"))
        let confirmBtn = Array.from(document.getElementsByClassName("confirm_button"))

        //Add an event listener to all checkboxes on event "change"
        allCheckboxes.forEach(chk=> {
            chk.addEventListener("change", e => {
                let cardNumber = e.target.parentNode.id.split("-")[1]
                let cardCheckboxes = Array.from(document.getElementsByClassName("checkbox_card_"+cardNumber))
               
                //If any checkbox is checked then we will remove the disable attribute
                if (cardCheckboxes.map(cx => cx.checked).includes(true)){
                    
                    confirmBtn[cardNumber-1].removeAttribute("disabled")
                    
                }else confirmBtn[cardNumber-1].setAttribute("disabled", "true")                
            })
        })

        confirmBtn.forEach(btn => {

            btn.addEventListener("click",(e)=>{

                let clicked_card = e.target.id.split("-")[1]
                
                let checkbox = Array.from(document.getElementsByClassName("checkbox_card_"+clicked_card))
                let checkmark = Array.from(document.getElementsByClassName("checkmark_card_"+clicked_card))

                //This filter + map combination will return an array with the player's answers such as: ["b","c","e"]
                let markedCheckboxes = checkbox.filter(box => box.checked === true).map(element=>element.id.split("-")[1]);
                
                //This is the method that will check if the answers are correct. It takes as parameters the player's answers 
                //obtained above, the specific quiz card answered and the player object
                this.correct(markedCheckboxes, this.cards[clicked_card-1], player)

                //After the player's answer is confirmed, we remove the interactive elements from Quiz Card
                checkbox.map(chck => chck.remove())
                checkmark.map(chck => chck.remove())
                btn.setAttribute("disabled", "true")
                btn.remove()
             })
        })
    }

    correct(markedCheckboxes, card, player){
        let cardDiv = document.getElementById("card-"+(card.card_id))

        //The answer will only be correct if the user chooses all the correct answers!
        //The isAnswerCorrect variable will only be true if it passes all three tests. 
        let isAnswerCorrect = Array.isArray(markedCheckboxes) &&
        Array.isArray(card.right_answer) && //Makes sure that both are of type Array
        markedCheckboxes.length === card.right_answer.length && //This tests if both arrays are of the same length
        markedCheckboxes.every((val, index) => val === card.right_answer[index]); // This tests if all elements are the same

        if (isAnswerCorrect){
            for (let rightAns of card.right_answer){
                let rightAnsDiv = document.getElementById("option-"+card.card_id+"-"+rightAns)
                rightAnsDiv.classList.add("user-right-answer")
            }
            cardDiv.classList.add("card-write-answer")//Add the write-answer class (turns Quiz Card green)
            player.printCurrentPoints(true,card.card_id) //Update player points on screen
            this.endOfTheQuizGame(player) //Check for the end of the Quiz (Was this the last remaining question?)

        }else {
            for (let rightAns of card.right_answer){
                let rightAnsDiv = document.getElementById("option-"+card.card_id+"-"+rightAns)
                rightAnsDiv.classList.add("right-answer")
            }
            for (let wrongAns of markedCheckboxes){
                let wrongAnsDiv = document.getElementById("option-"+card.card_id+"-"+wrongAns)
                wrongAnsDiv.classList.add("user-wrong-answer")
            }
            cardDiv.classList.add("card-wrong-answer")//Add the wrong-answer class (turns Quiz Card red)
            player.printCurrentPoints(false,card.card_id)//Update player points on screen
            this.endOfTheQuizGame(player)//Check for the end of the Quiz (Was this the last remaining question?)
        }
    }

    endOfTheQuizGame(player){
        
        this.questionsAnswered++
                
        if (this.questionsAnswered == this.numberOfQuestions){
            //Clean up our Main section when the player answered all questions
            let main = document.getElementById("main")
            main.innerHTML = ""
            let div = document.createElement("div")
            div.id = "game-summary"
            let childDiv = document.createElement("div")
           
            //Set up a dialogue to informe the total score 
            //and to let the player restart the game
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
            input.id = "number-of-cards-input-reset"
            inputDiv.classList.add("for-number-input-reset")
            input.setAttribute("type","number")
            input.setAttribute("min", "5")
            input.setAttribute("max", "10")
            input.setAttribute("value", "10")
            inputDiv.appendChild(span)
            inputDiv.appendChild(input)

            let message = '"You Are On the Right Track! Keep Studying"'
           
            if(player.points/(this.numberOfQuestions*10)<0.3){
                message = '"You Need to Study More!"'
            }else if(player.points/(this.numberOfQuestions*10)>=0.8){
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
                div.remove()
                let valueFromUser = input.value
                inputDiv.id = "number-of-cards-input"
                //This method gives a clean canvas to work with in case the user wants to play a new game
                this.resetTheGame(player)

                this.controlNumberOfQuestions(player, valueFromUser, restartBtn, inputDiv)
            })   
        }
    
        return 1
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