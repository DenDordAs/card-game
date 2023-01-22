let hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    interval

function create_cards() {

    let cards_play = document.querySelector(".cards_play")
    let count_field = document.getElementById("count_element").value

    document.getElementById("count_element").setAttribute("value", count_field)

    if (document.querySelector("#elements")) {
        document.querySelector("#elements").remove()
    }
    cards_play.innerHTML += '<ul id="elements"></ul>'

    let button_play = document.getElementById("button_play")
    button_play.children[1].textContent = "Перезапустити гру"

    let array_elem = ["Img/blue.jpg", "Img/green.jpg", "Img/red.png", "Img/violet.jpg", "Img/yellow.jpg"]
    let cards = []
    let number_cards = 0
    let elem = document.querySelector("#elements")

    for (let i = 0; i < Math.trunc(count_field / 2); i++) {
        number_cards == array_elem.length ? number_cards = 0 : false

        cards.push(array_elem[number_cards])
        cards.push(array_elem[number_cards])
        number_cards++
    }

    for (let i = 0; i < cards.length; i++) {
        let j = Math.floor(Math.random() * cards.length)
        let k = cards[i]

        cards[i] = cards[j]
        cards[j] = k
    }

    for (let i = 0; i < Math.trunc(count_field / 2) * 2; i++) {
        document.querySelector("#elements").innerHTML += '<li><img src="' + cards[i] + '" alt="Error404" class="back"><div class="front"></div></li>'
    }

    for (let i = 0; i < elem.childElementCount; i++) {
        elem.children[i].style.width = 100 / Math.sqrt(count_field) - 6 + "vw"
        elem.children[i].style.height = 100 / Math.sqrt(count_field) - 6 + "vw"
    }

    let clickable = true
    let first_card = null
    let second_card = null
    let open_pair_cards = 0
    let number_card_openings = 0
    let cards_left = cards.length
    let start_time = true
    let info_play = document.querySelector(".info_play")

    for (let i = 0; i < cards.length; i++) {
        elem.children[i].children[1].addEventListener("click", () => {
            cards_left--

            if (cards_left == 0) {
                clearInterval(interval)

                let info_plays

                if (JSON.parse(localStorage.getItem("info_plays") != null)) {
                    info_plays = JSON.parse(localStorage.getItem("info_plays"))
                } else {
                    info_plays = []
                }

                info_plays.push([{
                    hour: hours,
                    minute: minutes,
                    second: seconds,
                    millisecond: milliseconds,
                    cards_length: cards.length,
                    attempts: number_card_openings
                }])

                localStorage.setItem("info_plays", JSON.stringify(info_plays))

                hours = 0
                minutes = 0
                seconds = 0
                milliseconds = 0
            }

            number_card_openings++

            info_play.children[0].children[0].textContent = "Всього карток: " + cards.length
            info_play.children[0].children[2].textContent = "Відкривали картки: " + number_card_openings + " раз"

            if (start_time) {
                time_play()
                start_time = false
            }

            if (!elem.children[i].classList.contains("active_cards") && clickable == true && !elem.children[i].classList.contains("open_card")) {
                elem.children[i].classList.add("open_card")

                if (first_card == null) {
                    first_card = i
                } else {
                    if (i != first_card) {
                        second_card = i
                        clickable = false
                    }
                }

                if (first_card != null && second_card != null && i != first_card) {
                    setTimeout(() => {
                        if (elem.children[second_card].children[0].getAttribute("src") == elem.children[first_card].children[0].getAttribute("src")) {
                            open_pair_cards++

                            info_play.children[0].children[1].textContent = "Кількість пар підібрано: " + open_pair_cards + " з " + cards.length / 2

                            elem.children[first_card].classList.add("active_cards")
                            elem.children[first_card].classList.remove("open_card")
                            elem.children[second_card].classList.add("active_cards")
                            elem.children[second_card].classList.remove("open_card")
                        } else {
                            cards_left += 2
                            elem.children[first_card].classList.remove("open_card")
                            elem.children[second_card].classList.remove("open_card")
                        }

                        first_card = null
                        second_card = null
                        clickable = true
                    }, 300)
                }
            }
        })
    }
}

function time_play() {
    document.querySelector(".info_play").innerHTML += `
    <div class="time">
        <div class="time_name">
            <p>hr</p>
            <p>min</p>
            <p>sec</p>
            <p>mil</p>
        </div>
        <div class="time_play">
            <div class="hour">00</div>
            <p>:</p>
            <div class="minute">00</div>
            <p>:</p>
            <div class="second">00</div>
            <p>:</p>
            <div class="millisecond">00</div>
        </div>
    </div>`

    let hour_elem = document.querySelector(".hour")
    let minute_elem = document.querySelector(".minute")
    let second_elem = document.querySelector(".second")
    let millisecond_elem = document.querySelector(".millisecond")

    clearInterval(interval)
    interval = setInterval(timer, 10)

    function timer() {
        milliseconds++

        time(milliseconds, millisecond_elem, 99)
        time(seconds, second_elem, 59)
        time(minutes, minute_elem, 59)
        time(hours, hour_elem, 23)

        function time(time, time_elem, max_time) {
            if (time < 10) {
                time_elem.textContent = "0" + time
            } else if (time <= max_time) {
                time_elem.textContent = time
            } else {
                if(time == milliseconds){
                    seconds++
                    milliseconds = 0
                }else if(time == seconds){
                    minutes++
                    seconds=0
                }else if(time == minutes){
                    hours++
                    minutes=0
                }else{
                    hours=0
                }
                time=0
                time_elem.textContent = "0" + time
            }
        }
    }
}