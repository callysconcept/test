 function checkNetConnection(){
  var xhr = new XMLHttpRequest();
 var file = "https://raw.githubusercontent.com/callysconcept/247votes/main/version.txt";
 var r = Math.round(Math.random() * 10000);
 
 try {
xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var version = this.responseText.split(" || ");
if(20000 >= version[0]){
   return true;
  } else {
	  //navigator.vibrate(500);
	  alert("APP OUTDATED!!!\n"+version[1]);
	  if(version[2]){
		  window.open(version[2]);
	  }
	  var dura = 3000;
    setTimeout(function() {
	  navigator.app.exitApp();
	  }, dura);
   return false;
  }
       }
    };
	xhr.open('GET', file + '?subins=' + r,true);
  xhr.send();
	
 } catch (e) {
   return true;
 }
}
checkNetConnection();
