
//Венера 
 function togglePlay() {
	var myAudio = document.getElementById("myAudio");
	myAudio.volume = 0.5;
	return myAudio.paused ? myAudio.play() : myAudio.pause();
};
function togglePlay2(myZvuk) {
	var myZvuk = document.getElementById("myZvuk");
	myZvuk.volume = 0.15;
	return myZvuk.paused ? myZvuk.play() : myZvuk.pause();
};
// -------------------------------------

