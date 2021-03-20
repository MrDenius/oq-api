const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");

canvas.height = document.body.clientHeight * 0.9;
canvas.width = document.body.clientHeight * 0.9;

let pass = (canvas.height + 1) / 10;

const Main = () => {
	DrawSharp();
	DrawWords(GenerateLetters(["слово"]));
};

const GenerateLetters = (words) => {
	const MAX_LETTERS = 9;

	const letters = "йцукенгшщзхъфывапролджэячсмитьбюё".split("");
	const ltrs = [];

	const RandLetter = () => {
		let rand = 0 - 0.5 + Math.random() * (letters.length - 1 - 0 + 1);
		return letters[Math.round(rand)];
	};
	for (let x = 0; x <= MAX_LETTERS; x++) {
		ltrs[x] = [];
		for (let y = 0; y <= MAX_LETTERS; y++) {
			ltrs[x][y] = RandLetter();
		}
	}

	return ltrs;
};

const GetLogicSharp = () => {};

const DrawWords = (letter) => {
	let XX = 0;
	let YY = 0;
	for (let y = pass / 2; y <= canvas.height; y += pass) {
		for (let x = pass / 2; x <= canvas.width; x += pass) {
			ctx.font = `${pass}px serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			ctx.fillText(letter[XX][YY] || "A", x, y);
			XX++;
		}
		YY++;
		XX = 0;
	}
};

const DrawSharp = () => {
	ctx.beginPath();
	let i = 0;
	while (i <= canvas.height) {
		i += pass;
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
	}
	ctx.closePath();
	ctx.stroke();
};

Main();
