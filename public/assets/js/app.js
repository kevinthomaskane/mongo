
var articleId;

if ($("#modalNote").text().length >= 1){
  console.log("in note if")
  $("#modalSubmit").text("Update Note");
}

$("#scrape").on("click", function(){
  $.get("/scrape").then(function(response){
    location.reload();
  });
});

$(document).on("click", ".save", function(){
  let id = $(this).attr("id");
  $.ajax({
    method: "PUT",
    url: "/save/" + id
  }).then(function(data){
    console.log(data);
  });
});

$(document).on("click", ".note", function(){
  articleId = $(this).attr("id");
  $.get("/getNotes/" + articleId).then(function(response){
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
  });
});

$(document).on("click", "#noteDelete", function(){
  $.ajax({
    method: "PUT",
    url: "/deleteNote/" + articleId
  }).then(function(response){
    $("#modalNote").text("");
  });
});


