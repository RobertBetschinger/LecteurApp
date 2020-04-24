//const socket = io("https://peer-instructions-server.herokuapp.com");
const socket = io('http://localhost:5000')
const messageContainer = document.getElementById("message-container");
const SingleAnswersContainer = document.getElementById(
    "SingleAnswersContainer"
);
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
//import io from 'socket.io-client';

console.log(socket);

const name = prompt("What is your name?");
//const name = "Lecteur"
appendMessage("You: ", "joined", true);
socket.emit("New User", name, true);

//Socket PartZ
socket.on("chat-message", (data) => {
    appendMessage(`${data.name}: `, `${data.message}`, false);
});

socket.on("Person joined", (name) => {
    appendMessage(`${name}: `, `Connected`, false);
});

socket.on("Person Disconnected", (name) => {
    appendMessage(`${name}: `, `Disconnected`, false);
});

socket.on("NewQuestion", (question) => {
    toggleFragenBlock(true);
    changeQuestion();
});

socket.on("question-answered", (PersonData) => {
    appendMessageErgebniss(PersonData.name, PersonData.value);
    adddata(PersonData.value);
});

socket.on("new-question-round", (value) => {
    clearChart();
});

//Chat
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage("You: ", message, true);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
    $("#message-input").data("emojioneArea").setText("");
});

function appendMessage(name, message, position) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = name;
    var html = [
        '<p class="text-ChatMessage"><span class="text-chatName">' +
        name +
        "</span>" +
        message +
        "</p>",
    ].join("\n");
    messageElement.innerHTML = html;
    if (position) {
        messageElement.classList.add("OuterMessageLeft");
    } else {
        messageElement.classList.add("OuterMessageRight");
    }

    messageContainer.append(messageElement);
}

function appendMessageErgebniss(name, value) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = name;
    var html = [
        '<p class="text-ChatMessage">' +
        name +
        " hat mit Antwortmöglichkeit: " +
        value +
        " geantwortet.</p>",
    ].join("\n");
    messageElement.innerHTML = html;
    console.log(value);
    console.log(SolutionsForAnswers.antwort2Sol);
    if (value == 1 && SolutionsForAnswers.antwort1Sol === true) {
        messageElement.classList.add("OuterMessageMiddleRight");
    }
    if (value == 2) {
        var bool = SolutionsForAnswers.antwort2Sol;
        console.log("Bool foloows:" + bool);
        if (bool == "true") {
            messageElement.classList.add("OuterMessageMiddleRight");
        }
    }
    if (value == 3 && SolutionsForAnswers.antwort3Sol === true) {
        messageElement.classList.add("OuterMessageMiddleRight");
    }
    if (value == 4 && SolutionsForAnswers.antwort4Sol === true) {
        messageElement.classList.add("OuterMessageMiddleRight");
    }

    if (value == 1 && SolutionsForAnswers.antwort1Sol != true) {
        messageElement.classList.add("OuterMessageMiddleFalse");
    }
    if (value == 2) {
        var bool = SolutionsForAnswers.antwort2Sol;
        console.log("Bool foloows:" + bool);
        if (bool != "true") {
            messageElement.classList.add("OuterMessageMiddleFalse");
        }
    }
    if (value == 3 && SolutionsForAnswers.antwort3Sol != true) {
        messageElement.classList.add("OuterMessageMiddleFalse");
    }
    if (value == 4 && SolutionsForAnswers.antwort4Sol != true) {
        messageElement.classList.add("OuterMessageMiddleFalse");
    }

    messageContainer.append(messageElement);
}

let SolutionsForAnswers;

//Question Bereich
const btnShowQuestion = document.getElementById("btnShowQuestion");
btnShowQuestion.addEventListener("click", function () {
    var whatisTrue = doesRightPArtContain();

    if (whatisTrue) {
        const question = collectQuestion();
        SolutionsForAnswers = collectRightAnswers();
        socket.emit("NewQuestion", question);
        socket.emit("newPhase", "Answering");
        clearChart();
        changeLabels(question)
        clearStudentAnswers();
        document.getElementById("myChart").style.visibility = "visible";
        btnLecteuring.style.backgroundColor = "dodgerblue";
        btnShowQuestion.style.backgroundColor = "yellow";
        btnShowQuestion2.style.backgroundColor = "dodgerblue";
        btnShowScore.style.backgroundColor = "dodgerblue";
        alert("Questions was sucessfully published.");
    } else {
        window.alert("Bitte genau eine Frage in den Auswhalbereich hinzufügen.");
    }
});

//Question Bereich
const btnShowQuestion2 = document.getElementById("btnShowQuestion2");
btnShowQuestion2.addEventListener("click", function () {
    var whatisTrue = doesRightPArtContain();
    if (whatisTrue) {
        const question = collectQuestion();
        socket.emit("NewQuestion", question);
        socket.emit("newPhase", "Answering");
        clearChart();
        changeLabels(question)
        clearStudentAnswers();
        document.getElementById("myChart").style.visibility = "visible";
        btnLecteuring.style.backgroundColor = "dodgerblue";
        btnShowQuestion.style.backgroundColor = "dodgerblue";
        btnShowQuestion2.style.backgroundColor = "yellow";
        btnShowScore.style.backgroundColor = "dodgerblue";
        alert("Questions was sucessfully published.");
    } else {
        window.alert("Bitte genau eine Frage in den Auswhalbereich hinzufügen.");
    }
});

const btnLecteuring = document.getElementById("btnLecteuring");
btnLecteuring.addEventListener("click", function () {
    socket.emit("newPhase", "Lecteuring");
    clearChart();
    clearStudentAnswers();
    document.getElementById("myChart").style.visibility = "hidden";
    btnLecteuring.style.backgroundColor = "yellow";
    btnShowQuestion.style.backgroundColor = "dodgerblue";
    btnShowQuestion2.style.backgroundColor = "dodgerblue";
    btnShowScore.style.backgroundColor = "dodgerblue";
});

//Send Statistics
const btnShowScore = document.getElementById("btnScore");
btnScore.addEventListener("click", function () {
    btnLecteuring.style.backgroundColor = "dodgerblue";
    btnShowQuestion.style.backgroundColor = "dodgerblue";
    btnShowQuestion2.style.backgroundColor = "dodgerblue";
    btnShowScore.style.backgroundColor = "yellow";
    const question = collectQuestion();
    socket.emit("showStatistics",question);
});

//Show new Student Data
function appendStudentAnswered(name, value) {
    const answerElement = document.createElement("div");
    answerElement.innerText =
        name + " hat mit Antwortmöglichkeit: " + value + " geantwortet.";
    SingleAnswersContainer.append(answerElement);
}

//Clear all Student Data
function clearStudentAnswers() {
    SingleAnswersContainer.innerHTML = "";
}

function collectQuestion() {
    var rightContainer = document.getElementById("right");
    let matches = rightContainer.querySelectorAll(".draggable");

    const question = {
        ques: matches[0].querySelector(".details").querySelector(".ques").innerHTML,
        antwort1: matches[0].querySelector(".details").querySelector(".first")
            .innerHTML,
        antwort2: matches[0].querySelector(".details").querySelector(".second")
            .innerHTML,
        antwort3: matches[0].querySelector(".details").querySelector(".third")
            .innerHTML,
        antwort4: matches[0].querySelector(".details").querySelector(".fourth")
            .innerHTML,
    };
    return question;
}

function collectRightAnswers() {
    var rightContainer = document.getElementById("right");
    let matches = rightContainer.querySelectorAll(".draggable");

    const questionSols = {
        antwort1Sol: matches[0]
            .querySelector(".details")
            .querySelector(".firstSolution").innerHTML,
        antwort2Sol: matches[0]
            .querySelector(".details")
            .querySelector(".secondSolution").innerHTML,
        antwort3Sol: matches[0]
            .querySelector(".details")
            .querySelector(".thirdSolution").innerHTML,
        antwort4Sol: matches[0]
            .querySelector(".details")
            .querySelector(".fourthSolution").innerHTML,
    };
    console.log(questionSols.antwort1Sol);
    console.log(questionSols.antwort2Sol);
    console.log(questionSols.antwort3Sol);
    console.log(questionSols.antwort4Sol);
    return questionSols;
}