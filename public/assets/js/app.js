

$("#scrape").on("click", function(){
  $.get("/scrape").then(function(response){
    location.reload();
  })
});

$(document).on("click", ".save", function(){
  
})

