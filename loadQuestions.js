$(document).ready(function() {
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

function loadParameter1s() {
    sValue = $("option:selected", select).text()
    var selectBox = document.getElementById("selectCategorys");
    var op = selectBox.options[selectBox.selectedIndex];
    var optgroup = op.parentNode;
    var cValue = optgroup.label
    console.log(sValue)

    fragenData = loadQuestions(cValue, sValue).then(data => {
            console.log("JSON Sollte kommen");
            var string = JSON.stringify(data);
            var json = JSON.parse(string)
            fragenArray = json
            //console.log(fragenArray);
            
        }).catch((data) =>
            reject(data)
        )
        addQuestionsToPage(fragenData);
}

async function loadParameters(){
    sValue = $("option:selected", select).text()
    var selectBox = document.getElementById("selectCategorys");
    var op = selectBox.options[selectBox.selectedIndex];
    var optgroup = op.parentNode;
    var cValue = optgroup.label

    try{
        let fragenArray = await loadQuestions(cValue, sValue);
        addQuestionsToPage(fragenArray);
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
                    ' <button class="buttonActivate">Activate</button>'+
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
               $newButton +
                '</details>')
               $("#DetailsContainer").append($newDiv);              
     }
})};




$(document).on("click", "button.buttonActivate" , function() {
    window.alert("akdkaska")
});
