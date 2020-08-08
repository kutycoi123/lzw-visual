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
		let result = {
			encoded: "",
			steps: []
		};
		let dict = {...INITIAL_DICT};
		let len = input.length, dict_len = Object.keys(dict).length;
		let s = input[0];	
		let encoded = [];
		let s_start_idx = 0;
		let s_end_idx = 0;
		result.steps.push({
			s: {start:0, end:0, symbol: s}
		})
		for(let i = 1; i < len; ++i){
			let c = input[i];
			result.steps[result.steps.length - 1].c = {
				idx: i,
				symbol: c
			};
			if (dict[s+c]) {
				s = s + c;
				result.steps.push({
					s: {start:s_start_idx, end:i,symbol:s},
				});
				s_end_idx = i;
			}else {
				encoded.push(dict[s]);
				dict[s+c] = dict_len.toString();
				dict_len++;
				result.steps.push({
					encoded: [...encoded],
					old_s: {start: s_start_idx, end: s_end_idx},
					s: {start: i, end: i, symbol: s},
					new_entry: {entry: s+c, value: dict_len - 1}
				})
				s_start_idx = s_end_idx = i;
				s = c;
			}
		}
		encoded.push(dict[s]);
		result["encoded"] = encoded;
		result.steps.push({
			old_s: {start:s_start_idx, end:s_end_idx},
			encoded: [...encoded]
		});
		return result;
	}
	var inputs = generate_string(16);
	var inputDiv = $("#input");
	var outputDiv = $("#output");
	var run = $("#run");
	var generate = $("#generate");		
	var tblBody = $("#table-body");
	var dictBody = $("#dictionary-body");


	// Display input string
	for (let i = 0; i < inputs.length; ++i) {
		inputDiv.append(`<div class="symbol" id="sym-${i}">${inputs[i]}</div>`);
	}

	// Display dictionary table
	for (let char of CHARS) {
		dictBody.append(`<tr><th scope="row">${char}</th><td>${INITIAL_DICT[char]}</td></tr>`);
	}

	generate.on("click", function(){
		inputs = generate_string(16);
		inputDiv.html("");
		for (let i = 0; i < inputs.length; ++i) {
			inputDiv.append(`<div class="symbol" id="sym-${i}">${inputs[i]}</div>`);
		}		
	});

	run.on("click", function(){
		let result = lzw(inputs);
		let encoded_string = result.encoded.reduce((a, b) => a + " " + b)
		outputDiv.html("Output: ");
		tblBody.html("")
		$("html, body").animate({scrollTop: inputDiv.offset().top - 40});
		for (let i = 0; i < result.steps.length; ++i) {
			let timeout = setTimeout(function(){
				let rowInfo = {c: "", s: "", encoded: "", new_entry: ""};
				let step = result.steps[i];
				if (step["old_s"]) {
					for (let idx = step.old_s.start; idx <= step.old_s.end; ++idx){
						$(`#sym-${idx}`).css({
							backgroundColor:'white'
						});
					}
				} 
				if (step["s"]) {
					for (let idx = step.s.start; idx <= step.s.end; ++idx) {
						$(`#sym-${idx}`).css({
							backgroundColor: '#fc3a3a'
						});
					}
					rowInfo.s = step.s.symbol;
				}
				if (step["c"]) {
					$(`#sym-${step.c.idx}`).css({
						backgroundColor: '#1fc44e'
					});
					rowInfo.c = step.c.symbol;
				}
				if (step["encoded"]) {
					rowInfo.encoded = step.encoded.reduce((a,b) => a + " " + b);
				}
				if (step["new_entry"]) {
					rowInfo.new_entry += step.new_entry.entry + ":" + step.new_entry.value.toString();
				}
				tblBody.append(`<tr> <th scope="row">${i}</th><td>${rowInfo.s}</td><td>${rowInfo.c}</td><td>${rowInfo.encoded}</td><td>${rowInfo.new_entry}</td></tr>`)
				if (i == result.steps.length - 1) {
					outputDiv.html("Output: " + encoded_string);
				}
				clearTimeout(timeout);
			},800*i);
		}
	})
});