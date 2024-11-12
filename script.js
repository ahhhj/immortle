import { allowedguesses } from "./words/guesses.js";
import { allowedanswers } from "./words/answers.js";
let keys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Backspace", "Enter"];
let guesses = [];// this is formatted (y,x) unlike EVERYTHING ELSE whoopsie
let currentguess = [];
let guessnumber = 1;
let guessletter = 1;
let results = "Immortle\npuzzle number and performance don't matter \nhttps://ahhhj.github.io/immortle/\n";

let word;
let maxWords = 10;//I am so sorry I used a good naming convention for once
let todaywords = [];
//generate today's words
//starting seed is days past 2000
let seed = Math.floor(Date.now() / 86400000 + 0.5);
console.log(seed);
for (let i = 0; i < maxWords; i++) {
	let index = Math.floor(seededRandom(0, 2313));
	todaywords.push(allowedanswers[index].toUpperCase());
}
let wordindex = 0;
word = todaywords[wordindex];

//console.log(todaywords);

//add more comments to the code!!
//if you don't know how everything works you shouldn't be working on the code
document.addEventListener('mousedown', (e) => {
	if (e.target.className.includes("key")) {
		if (!e.target.className.includes("dummy")) {
			keypress("Key" + e.target.id);
			keypress(e.target.id);
		}

	}
	//indicates a win condition
	if(e.target.id == "status"){
		//console.log("clicked status");
	if (wordindex > maxWords || guessnumber == 7) {
		//console.log("copied");
		//copy results to clipboard
		navigator.clipboard.writeText(results);
	}
}
})
document.addEventListener('keydown', (e) => {
	let name = e.code;
	keypress(name);
});
function keypress(name) {
	if (keys.includes(name)) {
		if (name.substring(0, 3) == "Key") {
			let letter = name.substring(3);
			if (guessletter <= 5) {
				currentguess.push(letter);
				guessletter++;
			}
		}
		if (name == "Backspace") {
			if (guessletter >= 2) {
				currentguess.pop()
				guessletter--;
			}
		}
		if (name == "Enter") {
			if (guessletter == 6) {
				//validate guess
				let guessedword = currentguess[0] + currentguess[1] + currentguess[2] + currentguess[3] + currentguess[4];
				if (allowedguesses.includes(guessedword.toLowerCase()) || allowedanswers.includes(guessedword.toLowerCase())) {
					let copy = [];
					for (let i = 0; i < 5; i++) {
						copy[i] = currentguess[i];
					}
					guesses.push(copy)
					//have to do color checking ALL OVER AGAIN INEFFICIENTLY because I added copying the results much later
					let tempword = word;
					for(let i = 0; i < 5; i++){
						if(tempword[i] == currentguess[i]){
							// THIS IS SO CURSED HELP
							//WHY DOES IT STILL WORK ON NOTEPAD???
							results=results+"🟩";
							tempword = tempword.substring(0, i) + "_" + tempword.substring(i + 1, 5);
						} else if (tempword.includes(currentguess[i])){
							results=results+"🟨";
							tempword = tempword.substring(0, i) + "_" + tempword.substring(i + 1, 5);
						} else{
							results=results+"⬛";
						}
						
					}
					results=results+"\n";
					

					currentguess = [];
					guessletter = 1;
					guessnumber++;
					document.getElementById("status").innerText = "great!";
					//have to do color checking ALL OVER AGAIN INEFFICIENTLY because I added copying the results much later

				} else {
					document.getElementById("status").innerText = "Not in words list";
				}
				if (word == guessedword) {
					wordindex++;
					if (wordindex >= maxWords){
						document.getElementById("status").innerText = "You've bested me! results have been copied to clipboard. click here to copy them again.";
						navigator.clipboard.writeText(results);
						wordindex--;
					}else{
					document.getElementById("status").innerText = "You won! that time.";
					word = todaywords[wordindex];
					//re initialize the rest of the stuff
					let newword1 = guesses[1];
					let newword2 = guesses[guessnumber - 2];
					guesses = [newword1,newword2];
					currentguess = [];
					guessnumber = 3;
					guessletter = 1;
					}
					//this happens before game board update so its fine. I'm not adding animation.
				}
			}
		}
		if (guessnumber == 7) {
			document.getElementById("status").innerText = "You failed! you can still share your results, but everyone will shame you! (copied automatically or click here)";
			navigator.clipboard.writeText(results);
		}
	}
	updateboard();
}
function updateboard() {
	//existing guesses
	//varibles for coloring the keyboard
	let yesletters = [];
	let maybeletters = [];
	let noletters = [];
	for (let y = 0; y < 6; y++) {
		let tempword = word;


		for (let x = 0; x < 5; x++) {
			//reset stuff. wasn't so important before the whole letters changing thing but I redid it and now its less optimized
			let tile = document.getElementById("" + x + "," + y);
			tile.textContent = ("")
			tile.style.backgroundColor = "transparent";

			if (guesses[y]) {
				// if(guesses[y][x])
				//put the guessed letterin
				tile.textContent = (guesses[y][x]);
				//color it
				if (tempword[x] == guesses[y][x]) {
					tile.style.backgroundColor = "green";
					//remove that letter from the word in that position
					tempword = tempword.substring(0, x) + "_" + tempword.substring(x + 1, 5);
					yesletters.push(guesses[y][x]);
				} else if (tempword.includes(guesses[y][x])) {
					tile.style.backgroundColor = "yellow";
					//also remove it from the word
					let i = tempword.indexOf(guesses[y][x]);
					tempword = tempword.substring(0, i) + "_" + tempword.substring(i + 1, 5);
					maybeletters.push(guesses[y][x]);
				} else {
					noletters.push(guesses[y][x]);
				}
			}
		}
	}
	//the current guess
	for (let c = 0; c < 5; c++) {
		let tile = document.getElementById("" + c + "," + (guessnumber - 1));
		tile.textContent = ("")
		if (currentguess[c]) {
			tile.textContent = (currentguess[c]);
		}
	}
	//color the keyboard
	let key
	//clear every color first
	let allletters=["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
	for (let i = 0; i < allletters.length; i++) {
		key = document.getElementById(allletters[i].toUpperCase());
		key.style.backgroundColor = "transparent";
	}
	for (let i = 0; i < noletters.length; i++) {
		key = document.getElementById(noletters[i].toUpperCase());
		key.style.backgroundColor = "gray";
	}
	for (let i = 0; i < maybeletters.length; i++) {
		key = document.getElementById(maybeletters[i].toUpperCase());
		key.style.backgroundColor = "yellow";
	}
	for (let i = 0; i < yesletters.length; i++) {
		key = document.getElementById(yesletters[i].toUpperCase());
		key.style.backgroundColor = "green";
	}


}
//thanks olsn on indiegamr.com. I know you didn't make it up but you posted it which is what matters to me
//let seed = ... defined above based on calendar day

//this case doesn't count because i copy pasted the function name
function seededRandom(max, min) {
	max = max || 1;
	min = min || 0;

	seed = (seed * 9301 + 49297) % 233280;
	let rnd = seed / 233280;

	return min + rnd * (max - min);
}
