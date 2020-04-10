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
appendMessage('You: ', 'joined', true)
socket.emit('New User', name,true)


//Socket Part
socket.on('chat-message', data =>{
    appendMessage(`${data.name}: `,`${data.message}`,false)
})

socket.on('Person joined', name =>{
    appendMessage(`${name}: `, `Connected`,false)
} )

socket.on('Person Disconnected', name =>{
    appendMessage(`${name}: `, `Disconnected`,false)
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
    appendMessage('You: ', message,true)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  })

  function appendMessage(name,message,position) {
    const messageElement = document.createElement('div')
    messageElement.innerHTML=name
    var html =[
        '<p class="text-ChatMessage"><span class="text-chatName">' + name +'</span>' +message +'</p>'
    ].join("\n");
    messageElement.innerHTML = html
    if(position){
        messageElement.classList.add("OuterMessageLeft");
    }
    else{
        messageElement.classList.add("OuterMessageRight");
    }
    
    messageContainer.append(messageElement)
  }
 
//Question Bereich
const btnShowQuestion = document.getElementById("btnShowQuestion");
btnShowQuestion.addEventListener('click', function(){
    if(doesRightPArtContain){
        const question = collectQuestion(); 
        socket.emit('NewQuestion',question)
        socket.emit('newPhase','Answering')
        clearChart();
        clearStudentAnswers();
        document.getElementById("myChart").style.visibility ="visible"
    }
    else{
        window.alert("Bitte nur eine Frage in den Auswhalbereich hinzufügen.")
    }
})

//Question Bereich
const btnShowQuestion2 = document.getElementById("btnShowQuestion2");
btnShowQuestion2.addEventListener('click', function(){
    if(doesRightPArtContain){
        const question = collectQuestion(); 
        socket.emit('NewQuestion',question)
        socket.emit('newPhase','Answering')
        clearChart();
        clearStudentAnswers();
        document.getElementById("myChart").style.visibility ="visible"
    }
    else{
        window.alert("Bitte nur eine Frage in den Auswhalbereich hinzufügen.")
    }
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



function collectQuestion(){
    var rightContainer = document.getElementById("right")
    let matches = rightContainer.querySelectorAll('.draggable');
    
    const question ={
        ques:     matches[0].querySelector(".details").querySelector(".ques").innerHTML ,
        antwort1: matches[0].querySelector(".details").querySelector(".first").innerHTML ,
        antwort2: matches[0].querySelector(".details").querySelector(".second").innerHTML ,
        antwort3: matches[0].querySelector(".details").querySelector(".third").innerHTML ,
        antwort4: matches[0].querySelector(".details").querySelector(".fourth").innerHTML
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



