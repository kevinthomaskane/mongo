
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
})

$("#modalSubmit").on("click", function(){
  var object = {
    note: $("#inputNote").val().trim()
  }
  $.post("/note/" + articleId, object).then(function(response){
    console.log(response)
  })
})


