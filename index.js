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
			s: {start:0, end:0}
		})
		for(let i = 1; i < len; ++i){
			let c = input[i];
			result.steps.push({
				c: i
			})
			if (dict[s+c]) {
				s = s + c;
				result.steps.push({
					s: {start:s_start_idx, end:i},
				});
				s_end_idx = i;
			}else {
				encoded.push(dict[s]);
				dict[s+c] = dict_len.toString();
				dict_len++;
				result.steps.push({
					encoded: [...encoded],
					old_s: {start: s_start_idx, end: s_end_idx},
					s: {start: i, end: i},
				})
				s_start_idx = s_end_idx = i;
				s = c;
			}
		}
		encoded.push(dict[s]);
		result["encoded"] = encoded;
		result.steps.push({
			old_s: {start:s_start_idx, end:s_end_idx}
		});
		return result;
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
		let result = lzw(inputs);
		console.log(result)
		for (let i = 0; i < result.steps.length; ++i) {
			let timeout = setTimeout(function(){
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
							backgroundColor: 'red'
						});
					}
				}
				if (step["c"]) {
					$(`#sym-${step.c}`).css({
						backgroundColor: 'green'
					});
				}
				clearTimeout(timeout);
			},500*i);
		}
	})
});