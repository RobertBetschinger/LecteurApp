$(document).ready(function () {
  // hideElements();
  loadData();
});

var select = document.getElementById("selectCategorys");

function loadData() {
  console.log("loadData");
  $.ajax({
    type: "GET",
    url: "https://projektseminarlfrb.herokuapp.com/categorys",
    data: {},
    dataType: "json",
    success: function (data) {
      console.table(data);
      if (data == undefined || data == null || data.length == 0) {
        alert(
          "Es konnten keine Kategorien geladen werden, wsl. sind noch keine Kategorien vorhanden!"
        );
      } else {
        var string = JSON.stringify(data);

        var json = JSON.parse(string);

        fillInDataInDropdown(json);
      }
    },
    error: function (result) {
      console.log(result);
      alert("Es gab einen Fehler beim Laden der Daten!");
    },
  });
}

function fillInDataInDropdown(json) {
  console.log("fillInDataInDropdown");
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
    select.appendChild(el);
  }
}

const questionsbutton = document.getElementById("loadQuestions");
let fragenArray;
let fragenData;

async function loadParameters() {
  sValue = $("option:selected", select).text();
  var selectBox = document.getElementById("selectCategorys");
  var op = selectBox.options[selectBox.selectedIndex];
  var optgroup = op.parentNode;
  var cValue = optgroup.label;

  try {
    let fragenArray = await loadQuestions(cValue, sValue);
    //Show Questions Containers, load Question into box
    document.getElementById("DetailsContainer").style.visibility = "visible";
    document.getElementById("SelectedQuestion").style.visibility = "visible";
    console.log(fragenArray);
    appendEmptyContainer(fragenArray);
  } catch (error) {
    console.log(error);
  }
}

function loadQuestions(cValue, sValue) {
  console.log("loadQestion");
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "https://projektseminarlfrb.herokuapp.com/questions",
      data: {
        category_name: cValue,
        subcategory_name: sValue,
      },
      dataType: "json",
      success: function (data) {
        if (data == undefined || data == null || data.length == 0) {
          alert("Zu dieser Kategorie gibt es keine Fragen!");
          reject(data);
        } else {
          resolve(data);
        }
      },
      error: function (result) {
        console.log(result);
        reject(result);
        alert("Es gab einen Fehler beim Laden der Daten!");
      },
    });
  });
}

function hideElements() {
  //To Huide Details Container, Graph, Selected Question
  document.getElementById("DetailsContainer").style.visibility = "hidden";
  document.getElementById("SelectedQuestion").style.visibility = "hidden";
  document.getElementById("ChartContainer").style.visibility = "hidden";
}

function appendEmptyContainer(fragenArray) {
  fragenArray.forEach((element) => {
    if (element.triggerQuestion == true) {
      var html = [
        '<div class="draggable" draggable="true">',
        '<div class="details">',
        '<p class="ques">' + element.question + "</p>",
        "<ul>",
        '<li class="first">' + element.answers[0].aText + "</li>",
        '<li class="second">' + element.answers[1].aText + "</li>",
        '<li class="third">' + element.answers[2].aText + "  </li>",
        '<li class="fourth">' + element.answers[3].aText + "  </li>",
        "<br>",
        "</ul>",
        '<ul class="solutions" style="display:none">',
        '<li class="firstSolution">' + element.answers[0].trueOrFalse + "</li>",
        '<li class="secondSolution">' +
          element.answers[1].trueOrFalse +
          "</li>",
        '<li class="thirdSolution">' +
          element.answers[2].trueOrFalse +
          "  </li>",
        '<li class="fourthSolution">' +
          element.answers[3].trueOrFalse +
          "  </li>",
        "<br>",
        "</ul>",
        "<h3>Triggertyp: " + element.triggerType + " </h3>",
        "</div>",
        "</div>",
      ].join("\n");
      $("#QuestionsLeftContainer").append(html);
    } else {
      var html = [
        '<div class="draggable" draggable="true">',
        '<div class="details">',
        '<p class="ques">' + element.question + "</p>",
        "<ul>",
        '<li class="first">' + element.answers[0].aText + "</li>",
        '<li class="second">' + element.answers[1].aText + "</li>",
        '<li class="third">' + element.answers[2].aText + "  </li>",
        '<li class="fourth">' + element.answers[3].aText + "  </li>",
        "<br>",
        "</ul>",
        '<ul class="solutions" style="display:none">',
        '<li class="firstSolution">' + element.answers[0].trueOrFalse + "</li>",
        '<li class="secondSolution">' +
          element.answers[1].trueOrFalse +
          "</li>",
        '<li class="thirdSolution">' +
          element.answers[2].trueOrFalse +
          "  </li>",
        '<li class="fourthSolution">' +
          element.answers[3].trueOrFalse +
          "  </li>",
        "<br>",
        "</ul>",
        "</div>",
        "</div>",
      ].join("\n");
      $("#QuestionsLeftContainer").append(html);
    }
  });

  draggables = document.querySelectorAll(".draggable");
  containers = document.querySelectorAll(".container");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
}

let draggables;
let containers;

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function doesRightPArtContain() {
  var rightContainer = document.getElementById("right");
  let matches = rightContainer.querySelectorAll(".draggable");
  if (matches.length >= 2) {
    return false;
  }
  if (matches.length == 0) {
    return false;
  } else {
    return true;
  }
}

/*
  
  
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
  
  
  
  
  
  // Drag Functions
  
  function dragStart() {
  
    console.log(this)
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
      this.append(fills);
  }
  else{
      this.className = ' empty'
      this.append(fill);
  }
  }
  */
