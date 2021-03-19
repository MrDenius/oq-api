const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");

canvas.height = document.body.clientHeight * 0.9;
canvas.width = document.body.clientHeight * 0.9;

let pass = (canvas.height + 1) / 10;

const Main = () => {
	DrawSharp();
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
