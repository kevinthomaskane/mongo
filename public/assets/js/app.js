
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
  $.ajax({
    method: "PUT",
    url: "/save/" + id
  }).then(function(data){
  });
});

$(document).on("click", ".note", function(){
  articleId = $(this).attr("data-id");
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

$(document).on("click", ".remove", function(){
  let id = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/removeSaved/" + id
  }).then(function(response){
    location.reload();
  });
});

$('.collapse').collapse();


