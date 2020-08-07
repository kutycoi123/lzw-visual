const CHARS = "ABCDE";
const INITIAL_DICT = {
	"A": "0",
	"B": "1",
	"C": "2", 
	"D": "3",
	"E": "4"
}
function generate_string(len) {
	let str = "";
	for (let i = 0; i < len; ++i) {
		let rand_char = CHARS[Math.floor(Math.random() * CHARS.length)];
		str += rand_char;
	}
	return str;
}

$(document).ready(function(){
	function lzw(input) {
		let dict = {...INITIAL_DICT};
		let i = 1, len = input.length, dict_len = Object.keys(dict).length;
		let s = input[0];
		let encoded = [];
		while (i < len) {
			let c = input[i];
			if (dict[s+c]) {
				s = s + c;
			}else {
				encoded.push(dict[s]);
				dict[s+c] = dict_len.toString();
				dict_len++;
				s = c;
			}
			i++;
		}
		encoded.push(dict[s]);
		return encoded;
	}
	var inputs = "";
	inputs = "CCBDCCEAAAEACBBA"//generate_string(10);
	console.log(inputs);
	var inputDiv = $("#input");
	for (let i = 0; i < inputs.length; ++i) {
		inputDiv.append(`<div class="symbol" id="sym-${i}">${inputs[i]}</div>`);
	}
	var handler = $("#handler");
	handler.on("click", function(){
		let encoded = lzw(inputs);
		console.log(encoded);
	})
});