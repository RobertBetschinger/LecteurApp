//const socket = io('https://peer-instructions-server.herokuapp.com')
const socket = io('http://localhost:5000')
const messageContainer = document.getElementById('message-container')
const SingleAnswersContainer = document.getElementById('SingleAnswersContainer')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
//import io from 'socket.io-client';

console.log(socket);

//const name = prompt('What is your name?')
const name = "Lecteur"
appendMessage('you Joined')
socket.emit('New User', name)


//Socket Part
socket.on('chat-message', data =>{
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('Person joined', name =>{
    appendMessage(`${name} Connected`)
} )

socket.on('Person Disconnected', name =>{
    appendMessage(`${name} Disconnected`)
} )

socket.on('NewQuestion', question =>{
    toggleFragenBlock(true);
    changeQuestion();
} )

socket.on('question-answered', PersonData =>{
    appendStudentAnswered(PersonData.name,PersonData.value)
    adddata(PersonData.value);
})

socket.on('new-question-round', value =>{
    clearChart();
})




//Chat
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  })

  function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.classList.add("OuterMessage");
    messageContainer.append(messageElement)
  }


//Question Bereich
const btnShowQuestion = document.getElementById("btnShowQuestion");
btnShowQuestion.addEventListener('click', function(){
    const question = collectQuestion();
    socket.emit('NewQuestion',question)
    socket.emit('newPhase','Answering')
    clearChart();
    clearStudentAnswers();
})

//Question Bereich
const btnShowQuestion2 = document.getElementById("btnShowQuestion2");
btnShowQuestion2.addEventListener('click', function(){
    const question = collectQuestion();
    socket.emit('NewQuestion',question)
    clearChart();
    clearStudentAnswers();
})


//Send Statistics
const btnShowScore = document.getElementById("btnScore");
btnScore.addEventListener('click', function(){ 
socket.emit('showStatistics')
})

//Show new Student Data
function appendStudentAnswered(name,value){
    const answerElement = document.createElement('div')
    answerElement.innerText = name +' hat mit Antwortmöglichkeit: ' + value + ' geantwortet.'
    SingleAnswersContainer.append(answerElement)
}

//Clear all Student Data
function clearStudentAnswers(){
    SingleAnswersContainer.innerHTML = '';
}

//
const SelectedQuestionPos0 = document.getElementById('SelectedQuestionPos0')
const SelectedQuestionPos1 = document.getElementById('SelectedQuestionPos1')
const SelectedQuestionPos2 = document.getElementById('SelectedQuestionPos2')
const SelectedQuestionPos3 = document.getElementById('SelectedQuestionPos3')
const SelectedQuestionPos4 = document.getElementById('SelectedQuestionPos4')

function collectQuestion(){

    const question ={
        ques:     SelectedQuestionPos0.innerText ,
        antwort1: SelectedQuestionPos1.innerText ,
        antwort2: SelectedQuestionPos2.innerText ,
        antwort3: SelectedQuestionPos3.innerText ,
        antwort4: SelectedQuestionPos4.innerText 
    }

    return question;
}

function updateSelectedQuestion(question){
    SelectedQuestionPos0.innerHTML ='',
    SelectedQuestionPos1.innerHTML =''
    SelectedQuestionPos2.innerHTML =''
    SelectedQuestionPos3.innerHTML =''
    SelectedQuestionPos4.innerHTML =''
}



