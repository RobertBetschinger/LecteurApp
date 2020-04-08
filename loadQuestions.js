$(document).ready(function() {
   // hideElements();
    loadData();
});

var select = document.getElementById("selectCategorys");

function loadData() {
    console.log("loadData")
    $.ajax({
        type: 'GET',
        url: 'https://projektseminarlfrb.herokuapp.com/categorys',
        data: {},
        dataType: 'json',
        success: function(data) {
            console.table(data);
            if (data == undefined || data == null || data.length == 0) {
                alert('Es konnten keine Kategorien geladen werden, wsl. sind noch keine Kategorien vorhanden!');
            } else {

                var string = JSON.stringify(data)

                var json = JSON.parse(string)

                fillInDataInDropdown(json)

            }
        },
        error: function(result) {
            console.log(result);
            alert("Es gab einen Fehler beim Laden der Daten!");
        }
    })
}

function fillInDataInDropdown(json) {
    console.log("fillInDataInDropdown")
    for (var i = 0; i < json.length; i++) {
        var el = document.createElement("OPTGROUP");
        el.label = json[i].category_name;
        el.value = json[i].category_id;

        for (var j = 0; j < json[i].sub_categories.length; j++) {
            if (json[i].sub_categories[j].subcategory_id != undefined) {
                var ellsub = document.createElement("option");
                ellsub.label = json[i].sub_categories[j].subcategory_name;
                ellsub.value = json[i].sub_categories[j].subcategory_id;
                ellsub.text = json[i].sub_categories[j].subcategory_name;
                el.appendChild(ellsub);
            }
        }
        select.appendChild(el)
    }
}

const questionsbutton = document.getElementById("loadQuestions");
let fragenArray
let fragenData



async function loadParameters(){
    sValue = $("option:selected", select).text()
    var selectBox = document.getElementById("selectCategorys");
    var op = selectBox.options[selectBox.selectedIndex];
    var optgroup = op.parentNode;
    var cValue = optgroup.label

    try{
        let fragenArray = await loadQuestions(cValue, sValue);
        //Show Questions Containers, load Question into box
        document.getElementById("DetailsContainer").style.visibility = "visible";
        document.getElementById("SelectedQuestion").style.visibility = "visible";
        console.log("appending empty container")
        appendEmptyContainer();
    } catch(error){
        console.log(error)
    }
}



function loadQuestions(cValue, sValue) {
    console.log("loadQestion")
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'https://projektseminarlfrb.herokuapp.com/questions',
            data: {
                "category_name": cValue,
                "subcategory_name": sValue
            },
            dataType: 'json',
            success: function(data) {

                if (data == undefined || data == null || data.length == 0) {
                    alert('Zu dieser Kategorie gibt es keine Fragen!');
                    reject(data)

                } else {

                    resolve(data)

                }
            },
            error: function(result) {
                console.log(result);
                reject(result)
                alert("Es gab einen Fehler beim Laden der Daten!");

            }
        })
    })
}

function hideElements(){
    //To Huide Details Container, Graph, Selected Question
      document.getElementById("DetailsContainer").style.visibility = "hidden";
      document.getElementById("SelectedQuestion").style.visibility = "hidden";
      document.getElementById("ChartContainer").style.visibility = "hidden";
}


var title = "Constructing HTML Elements";

var html = [
    '<div class="empty">',
    '<div id="comment1" class="fill" draggable="true">',
    '<div class="details">',
    '<h3>Beispielfrage</h3>',
    '<ul>', 
    '<li>   Pepsi</li>',
    '<li>   Cola</li>',
    '<li>   Gleichgut  </li>', 
    '<li>   Fantaaaaa  </li>', 
    '<br>', 
    '</ul>', 
    '<h3>Beispieltrigger </h3>', 
    '</div>',
    '</div>',
    '</div>'   
].join("\n");
// html: '<div ...>\n<h1 ...>Constructing HTML Elements<h1>\n</div>'

//$("DetailsContainer").append(html);

function appendEmptyContainer(){
    console.log("Rly Appending, inside Function")
    $("#DetailsContainer").append(html);
    //$("#DetailsContainer").append($newDiv);  
}







const fill = document.querySelector('.fill');
const empties = document.querySelectorAll('.empty');

// Fill listeners
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

// Loop through empty boxes and add listeners
for (const empty of empties) {
  empty.addEventListener('dragover', dragOver);
  empty.addEventListener('dragenter', dragEnter);
  empty.addEventListener('dragleave', dragLeave);
  empty.addEventListener('drop', dragDrop);
}

// Drag Functions

function dragStart() {
  this.className += ' hold';
  setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
  this.className = 'fill';
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += ' hovered';
}

const SelectedQuestionAnswer =document.getElementById("SelectedQuestionAnswer")
function dragLeave() {
    if(this.id == "right"){
        this.className = ' empty rightempty';
        SelectedQuestionAnswer.innerHTML ="Ziehen Sie hier die ausgewählte Frage hinein."
        
    }
    else{
        this.className = ' empty'
    }
  
 
}

function dragDrop() {

  if(this.id == "right"){
    this.className = ' empty rightempty';
    SelectedQuestionAnswer.innerHTML ="Momentan ausgewählte Frage"
    this.append(fill);
}
else{
    this.className = ' empty'
    this.append(fill);
}
}

function doesRightPArtContain(){
    try{
        const hasChildDiv = document.getElementById("right").querySelector("#comment1").querySelector("details").querySelector("summary")
        if (hasChildDiv !== null) {
            alert(hasChildDiv.innerHTML)}
    }catch{
        alert("nichts drin")
      } 
}


function changeText(){

}












/*
function addQuestionsToPage(fragenArray){
    
    fragenArray.forEach(element => {
    var $newDiv = $("<button/>")   // creates a div element                
            .addClass("buttonQuestion")   // add a class
            .innerhtml('<h2>' +element.question + '</h2>'+
                    '<br> <ul>' +
                    ' <br><li>' +  element.answers[0].aText+'</li>' +
                    ' <li>' +  element.answers[1].aText+'</li>' +
                    ' <li>' +  element.answers[2].aText + '</li>' +
                    ' <li>' +  element.answers[3].aText + '</li>' +
                    '<br>' +
                    '  </ul>' +
                    ' <h3>Trigger Typ: ' + element.triggerType + '</h3>');
                    $("#DetailsContainer").append($newDiv);  
    });
};
*/


















function addQuestionsToPage(fragenArray){
    var index = 0;
    fragenArray.forEach(element => {
        index++;

        var $newButton=$("<button/>")
        .addClass("buttonActivate")
        .attr("id","Test")
        .attr("value")

     if(element.triggerQuestion == true){
        var $newDiv = $("<div/>")   // creates a div element                
            .addClass("addedQuestion")   // add a class
            .html('<details>' +
                    '<summary>'+ 'Frage: ' +element.question + '</summary>'+
                    '<br> <ul>' +
                    ' <br><li>' +  element.answers[0].aText+'</li>' +
                    ' <li>' +  element.answers[1].aText+'</li>' +
                    ' <li>' +  element.answers[2].aText + '</li>' +
                    ' <li>' +  element.answers[3].aText + '</li>' +
                    '<br>' +
                    '  </ul>' +
                    ' <h3>Trigger Typ: ' + element.triggerType + '</h3>' +
                    '</details>');  
                   $("#DetailsContainer").append($newDiv);
     } else{
        var $newDiv = $("<div/>")   // creates a div element                
        .addClass("addedQuestion")   // add a class
        .html('<details>' +
                '<summary>'+ 'Frage: ' +element.question + '</summary>'+
                '<br> <ul>' +
                ' <br><li>' +  element.answers[0].aText+'</li>' +
                ' <li>' +  element.answers[1].aText+'</li>' +
                ' <li>' +  element.answers[2].aText + '</li>' +
                ' <li>' +  element.answers[3].aText + '</li>' +
                '<br>' +
                '  </ul>' +             
                '</details>')
               $("#DetailsContainer").append($newDiv);              
     }
})};





