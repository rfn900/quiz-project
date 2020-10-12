class Player{
    constructor(name = ""){
        this.name = name,
        this.points = 0
    }
    printCurrentPoints(isRight, clicked_card_id){
        //This method keeps the current player points updated on the screen
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
        //This method initializes the particular area where the 
        //current player points will be displayed
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
