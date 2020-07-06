const socket = io("https://peer-instructions-server.herokuapp.com");
//const socket = io("http://localhost:5000");
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

socket.on("private-message", (privMessageObj) => {
  appendMessagePrivateOthers(privMessageObj.name, privMessageObj.message);
});

//Chat
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let selectedRoom = loadSelectedChatRoom();
  partnerName = $("option:selected", selectNames).text();
  const message = messageInput.value;
  //Buiild in Must Chat
  if (message == "") {
    alert("Bitte geben Sie eine Nachricht in das Textfeld ein!");
    return;
  }

  if (selectedRoom === "group") {
    appendMessage("You: ", message, true);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
    $("#message-input").data("emojioneArea").setText("");
  } else {
    const data = {
      message: message,
      id: selectedRoom,
    };
    socket.emit("Private-Message", data, (answer) => {
      if (answer) {
        alert("Pls dont send messages at yourself");
      } else {
        appendMessagePrivateOwn("You: ", message, partnerName);
        messageInput.value = "";
        $("#message-input").data("emojioneArea").setText("");
      }
    });
  }
});

function appendMessagePrivateOwn(name, message, partnerName) {
  const messageElement = document.createElement("div");

  var html = [
    '<p class="text-ChatMessage"><span class="text-priv">' +
      "This is a private message to: " +
      partnerName +
      "</span>" +
      '<p class="text-ChatMessage"><span class="text-chatName">' +
      name +
      "</span>" +
      message +
      "</p>",
  ].join("\n");
  messageElement.innerHTML = html;

  messageElement.classList.add("OuterMessageLeft");

  messageContainer.append(messageElement);
}

function appendMessagePrivateOthers(name, message) {
  const messageElement = document.createElement("div");

  var html = [
    '<p class="text-ChatMessage"><span class="text-priv">' +
      "This is a private message from: " +
      name +
      "</span>" +
      '<p class="text-ChatMessage"><span class="text-chatName">' +
      name +
      ": " +
      "</span>" +
      message +
      "</p>",
  ].join("\n");
  messageElement.innerHTML = html;

  messageElement.classList.add("OuterMessageRight");

  messageContainer.append(messageElement);
}

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
  console.log("AppendMessageErgebniss");
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

  var antwort1 = SolutionsForAnswers.antwort1Sol == "true";
  var antwort2 = SolutionsForAnswers.antwort2Sol == "true";
  var antwort3 = SolutionsForAnswers.antwort3Sol == "true";
  var antwort4 = SolutionsForAnswers.antwort4Sol == "true";

  console.log(value);
  console.log(antwort1);

  if (value == 1) {
    if (antwort1) {
      messageElement.classList.add("OuterMessageMiddleRight");
    }
  }
  if (value == 2) {
    if (antwort2) {
      messageElement.classList.add("OuterMessageMiddleRight");
    }
  }
  if (value == 3) {
    if (antwort3) {
      messageElement.classList.add("OuterMessageMiddleRight");
    }
  }

  if (value == 4) {
    if (antwort4) {
      messageElement.classList.add("OuterMessageMiddleRight");
    }
  }

  if (value == 1) {
    if (!antwort1) {
      messageElement.classList.add("OuterMessageMiddleFalse");
    }
  }
  if (value == 2) {
    if (!antwort2) {
      messageElement.classList.add("OuterMessageMiddleFalse");
    }
  }

  if (value == 3) {
    if (!antwort3) {
      messageElement.classList.add("OuterMessageMiddleFalse");
    }
  }
  if (value == 4) {
    if (!antwort4) {
      messageElement.classList.add("OuterMessageMiddleFalse");
    }
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
    endTimer();
    clearChart();
    changeLabels(question);
    clearStudentAnswers();
    document.getElementById("myChart").style.visibility = "visible";
    btnPeerDiscussion.style.backgroundColor = "dodgerblue";
    btnLecteuring.style.backgroundColor = "dodgerblue";
    btnShowQuestion.style.backgroundColor = "yellow";
    btnShowQuestion2.style.backgroundColor = "dodgerblue";
    btnShowScore.style.backgroundColor = "dodgerblue";
    alert("Questions was sucessfully published.");
  } else {
    window.alert("Bitte genau eine Frage in den Auswhalbereich hinzufügen.");
  }
});

const btnPeerDiscussion = document.getElementById("btnDiscussion");
btnPeerDiscussion.addEventListener("click", function () {
  var whatisTrue = doesRightPArtContain();
  if (whatisTrue) {
    var time = prompt(
      "Please enter the Time for the Peer Discussion in whole Minutes"
    );
    if (time != null) {
      var minutes = parseInt(time);
      if (minutes == 0 || isNaN(minutes)) {
        alert("Pls enter a whole Number the Next Time!");
      } else {
        init(minutes);
        socket.emit("newPhase", "Peer Discussion");
        socket.emit("DiscussionTime", minutes);
        alert("You Started the Peer Discussion with " + minutes + " minutes");
        btnPeerDiscussion.style.backgroundColor = "yellow";
        btnLecteuring.style.backgroundColor = "dodgerblue";
        btnShowQuestion.style.backgroundColor = "dodgerblue";
        btnShowQuestion2.style.backgroundColor = "dodgerblue";
        btnShowScore.style.backgroundColor = "dodgerblue";
      }
    }
  } else {
    window.alert("Bitte genau eine Frage in den Auswhalbereich hinzufügen.");
  }
});

function init(minutes) {
  console.log("init");
  var time_in_minutes = minutes;
  start_countdown("div_clock", time_in_minutes);
}

function start_countdown(clockid, time_in_minutes) {
  console.log("start_countdown");
  //start the countdown
  var current_time = Date.parse(new Date());
  var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
  run_clock(clockid, deadline);
}

var timeinterval;
function run_clock(id, endtime) {
  console.log("run_clock");
  var clock = document.getElementById(id);

  function update_clock() {
    var t = time_remaining(endtime);
    clock.innerHTML =
      t.minutes.toString().padStart(2, "0") +
      ":" +
      t.seconds.toString().padStart(2, "0") +
      " left";
    if (t.total <= 0) {
      alert("Zeit abgelaufen");
      clearInterval(timeinterval);
    }
  }
  clearInterval(timeinterval);
  update_clock(); // run function once at first to avoid delay
  timeinterval = setInterval(update_clock, 1000);
}

function time_remaining(endtime) {
  console.log("time_remaining");
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

//Question Bereich
const btnShowQuestion2 = document.getElementById("btnShowQuestion2");
btnShowQuestion2.addEventListener("click", function () {
  var whatisTrue = doesRightPArtContain();
  if (whatisTrue) {
    const question = collectQuestion();
    socket.emit("NewQuestion", question);
    socket.emit("newPhase", "Answering");
    endTimer();
    clearChart();
    changeLabels(question);
    clearStudentAnswers();
    document.getElementById("myChart").style.visibility = "visible";
    btnPeerDiscussion.style.backgroundColor = "dodgerblue";
    btnLecteuring.style.backgroundColor = "dodgerblue";
    btnShowQuestion.style.backgroundColor = "dodgerblue";
    btnShowQuestion2.style.backgroundColor = "yellow";
    btnShowScore.style.backgroundColor = "dodgerblue";
    alert("Questions was sucessfully published.");
  } else {
    window.alert("Bitte genau eine Frage in den Auswhalbereich hinzufügen.");
  }
});

function endTimer() {
  var clock = document.getElementById("div_clock");
  clearInterval(timeinterval);
  clock.innerHTML = "";
}

const btnLecteuring = document.getElementById("btnLecteuring");
btnLecteuring.addEventListener("click", function () {
  socket.emit("newPhase", "Lecteuring");
  endTimer();
  clearChart();
  clearStudentAnswers();
  document.getElementById("myChart").style.visibility = "hidden";
  btnPeerDiscussion.style.backgroundColor = "dodgerblue";
  btnLecteuring.style.backgroundColor = "yellow";
  btnShowQuestion.style.backgroundColor = "dodgerblue";
  btnShowQuestion2.style.backgroundColor = "dodgerblue";
  btnShowScore.style.backgroundColor = "dodgerblue";
});

//Send Statistics
const btnShowScore = document.getElementById("btnScore");
btnScore.addEventListener("click", function () {
  endTimer();
  btnPeerDiscussion.style.backgroundColor = "dodgerblue";
  btnLecteuring.style.backgroundColor = "dodgerblue";
  btnShowQuestion.style.backgroundColor = "dodgerblue";
  btnShowQuestion2.style.backgroundColor = "dodgerblue";
  btnShowScore.style.backgroundColor = "yellow";
  const question = collectQuestion();
  socket.emit("showStatistics", question);
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

  let questionSols = {
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
  console.log(questionSols);
  return questionSols;
}

socket.on("Group-Changed", (users) => {
  console.log(users);
  fillInDataInDropdownUsers(users);
});

const selectNames = document.getElementById("namesSelect");
function fillInDataInDropdownUsers(users) {
  console.log("Update Group List");
  $("#namesSelect").find("option").remove().end();
  var GroupChat = document.createElement("option");
  GroupChat.label = "Gruppenchat";
  GroupChat.value = "group";
  GroupChat.text = "Gruppenchat";
  selectNames.appendChild(GroupChat);
  for (var j = 0; j < users.length; j++) {
    var ellsub = document.createElement("option");
    ellsub.label = users[j].userName;
    ellsub.value = users[j].id;
    ellsub.text = users[j].userName;
    selectNames.appendChild(ellsub);
  }
}

function loadSelectedChatRoom() {
  value = $("select#namesSelect option:checked").val();
  return value;
}
