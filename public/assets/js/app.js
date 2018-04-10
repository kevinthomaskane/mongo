
var articleId;

$("#scrape").on("click", function(){
  $.get("/scrape").then(function(response){
    location.reload();
  });
});

$(document).on("click", ".save", function(){
  var id = $(this).attr("id");
  $.ajax({
    method: "PUT",
    url: "/save/" + id
  }).then(function(data){
    console.log(data)
  });
});


$(document).on("click", ".note", function(){
  articleId = $(this).attr("id");
  $.get("/getNotes/" + articleId).then(function(response){
    if (response.length >= 1){
      $("#modalNote").text(response);
    }
  });
});

$("#modalSubmit").on("click", function(){
  var object = {
    body: $("#inputNote").val().trim()
  }
  $.post("/submitNote/" + articleId, object).then(function(response){
    console.log(response)
  })
})


