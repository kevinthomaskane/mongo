
var articleId;
var localStorageArray = [];
var buttonsArray = [];

$(document).ready(function(){
  for (var key in localStorage){
    if (key !== "length" && key !== "key" && key !== "getItem" &&
     key !== "setItem" && key !== "removeItem" && key !== "clear"){
      localStorageArray.push(key);
     }
  }
  getButtonIds();
  printButtons(localStorageArray, buttonsArray);
})

function getButtonIds(){
  $('.note').each(function() {
    buttonsArray.push($(this).attr("data-id"));
});
}

function printButtons(array1, array2){
  for (let i = 0; i < array1.length; i++){
    for (let j = 0; j < array2.length; j++){
      if (array1[i] === array2[j]){
        $(`[data-id="${array1[i]}"]`).text("View Note");
      }
    }
  }
}

$("#scrape").on("click", function(){
  $.get("/scrape").then(function(response){
    location.reload();
  });
});

$(document).on("click", ".getSummary", function(){
  $(".summaryArea").empty();
  console.log("requesting sumary")
  let link = $(this).attr("data-id");
  console.log(link)
  $.post("/summary", {link: link}).then(function(response){
    var array = response.articleText.split(" ")
    for (let i = 0; i < 40; i++){
      $(".summaryArea").append(`
      ${array[i]}
      `)
      if (i === 39){
        $(".summaryArea").append(".....")
      }
    }
  })
})

$(document).on("click", ".save", function(){
  let id = $(this).attr("data-id");
  buttonsArray.push(id);
  $.ajax({
    method: "PUT",
    url: "/save/" + id
  }).then(function(data){
  });
});

$(document).on("click", ".note", function(){
  articleId = $(this).attr("data-id");
  $.get("/getNotes/" + articleId).then((response) =>{
    if (response.length >= 1){
      $("#modalNote").text(response);
      $("#modalSubmit").text("Update Note");
    } else {
      $("#modalNote").text("");
    }
  });
});

$("#modalSubmit").on("click", function(){
  let object = {
    body: $("#inputNote").val().trim()
  }
  $.post("/submitNote/" + articleId, object).then(function(response){
    $("#inputNote").val("");
    $(`[data-id="${articleId}"]`).text("View Note");
    localStorage.setItem(articleId, articleId)
    console.log('hello')
  });
});

$(document).on("click", "#noteDelete", function(){
  $.ajax({
    method: "PUT",
    url: "/deleteNote/" + articleId
  }).then(function(response){
    $("#modalNote").text("");
    $(`[data-id="${articleId}"]`).text("Add a Note");
    localStorage.removeItem(articleId, articleId);
  });
});

$(document).on("click", ".remove", function(){
  let id = $(this).attr("data-item");
  $.ajax({
    method: "PUT",
    url: "/removeSaved/" + id
  }).then(function(response){
    location.reload();
  });
});

$('.collapse').collapse();


