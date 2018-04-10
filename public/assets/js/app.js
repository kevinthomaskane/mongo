

$("#scrape").on("click", function(){
  $.get("/scrape").then(function(response){
    location.reload();
  })
});

$(document).on("click", ".save", function(){
  var id = $(this).attr("id");
  $.ajax({
    method: "PUT",
    url: "/save" + id
  }).then(function(data){
    
  })
})

