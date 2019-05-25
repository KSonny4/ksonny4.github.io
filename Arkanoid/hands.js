window.addEventListener('load', ()=>{
      var status = document.getElementById("svgText");
      function updateStatus(event){
            var condition = navigator.onLine ? "online" : "offline";
            if(condition == "online"){
                  status.style.color = 'green';
            } else if (condition == "offline") {
                  status.style.color = 'red';
            }
            status.innerHTML = condition.toUpperCase();
      }

      window.addEventListener('online', updateStatus());
      window.addEventListener('offline', updateStatus());

});



document.getElementById('play').addEventListener('click', x=>{
      document.getElementById('game').style.display = 'flex';
   $('#game').css('display', 'inline');
   $('#game-start').css('display', 'none');    
});
