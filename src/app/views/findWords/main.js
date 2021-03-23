const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientHeight;

let MAX_LETTERS = 9;
let pass = (canvas.height + 1) / (MAX_LETTERS + 1);

const searchParams = new URLSearchParams(location.search);

let USER = {};

// let WORDS = ["слово", "найди", "игра"];

let WORDS = [
	"byte",
	"shorint",
	"integer",
	"word",
	"longint",
	"real",
	"single",
	"double",
	"extended",
	"comp",
];

// const WORDS = [
// 	"слово",
// 	"найди",
// 	"игра",
// 	"обрабатываемый",
// 	"осуществляется", //5
// 	"массиве",
// 	"проверку",
// 	"случайное",
// 	"целое",
// 	"число", //10
// ];

if (searchParams.get("words")) {
	WORDS = searchParams.get("words").split(";");
}

const NewPass = (cells) => {
	MAX_LETTERS = cells - 1;
	(canvas.height + 1) / (MAX_LETTERS + 1);
};

let IsMousedDown = false;

const CreateEventEmitter = () => {
	let callbackList = [];
	const emitter = {
		on(name, callback) {
			callbackList.push({ name: name, callback: callback });
			return emitter;
		},
		removeListener(callback) {
			callbackList = callbackList.filter(
				(value) => value.callback != callback
			);
			return emitter;
		},
		emit(name, args) {
			callbackList.forEach((callback) => {
				if (callback.name === name) callback.callback(args);
			});
			return emitter;
		},
	};

	return emitter;
};

const Main = () => {
	StartLogin(() => {
		this.ls = GetLogicSharp();
		console.log(this.ls);
	});
};

const Error = (message, code) => {
	code = code || 0;
	message = message || "Error";

	console.error(code, message);
};

const StartLogin = (callback) => {
	const $loginForm = document.querySelector("div#loginForm");
	const $input = document.querySelector("input#login");
	const $submit = document.querySelector("button#submit");

	$input.oninput = () => {
		if ($input.value.length <= 2) $submit.disabled = true;
		else $submit.disabled = false;
	};

	$submit.onclick = () => {
		$loginForm.style.display = "none";

		USER = {
			type: "find-words",
			name: $input.value,
			time: { start: Date.now() },
			img: {},
			logs: {},
		};

		if (callback) callback();
	};
};

const GenerateRandomLetters = (words) => {
	// const letters = "йцукенгшщзхъфывапролджэячсмитьбюё".split("");
	const letters = "qwertyuiopasdfghjklzxcvbnm".split("");
	const ltrs = { letters: [], words: [] };

	const RandLetter = () => {
		let rand = Math.random() * (letters.length - 1);
		return letters[Math.round(rand)];
	};
	for (let x = 0; x <= MAX_LETTERS; x++) {
		ltrs.letters[x] = [];
		for (let y = 0; y <= MAX_LETTERS; y++) {
			ltrs.letters[x][y] = RandLetter();
		}
	}

	return ltrs;
};

let WordsFounded = 0;
let WordsCount = 0;

const WordFoundHandler = (wm) => {
	if (WordsManager.length == WordsCount)
		WordsManager.forEach((wm) =>
			USER.words ? USER.words.push(wm.word) : (USER.words = [wm.word])
		);

	wm.ChangeColor("green");
	WordsManager = WordsManager.filter((value) => value != wm);
	WordsFounded++;

	USER.wordsFounded
		? USER.wordsFounded.push(wm.word)
		: (USER.wordsFounded = [wm.word]);

	console.log("Word", wm.word, "Founded");

	if (WordsCount === WordsFounded) {
		//COMLETE
		USER.time.end = Date.now();
		USER.img.completed = canvas.toDataURL();
		console.log("COMLETE");
		console.log(USER);
		USER.img = {};

		fetch("./sendResult", {
			method: "POST",
			body: JSON.stringify(USER),
			headers: { "Content-Type": "application/json" },
		});
		alert("Вы успешно прошли задание!");
	}
};

const InsertWords = (words, ls) => {
	const RandPos = () => ({
		x: Math.floor(Math.random() * (ls.cells.length - 1 - 0) + 0),
		y: Math.floor(Math.random() * (ls.cells.length - 1 - 0) + 0),
	});

	const Move = (lettersPos) => {
		const lastPos = lettersPos[lettersPos.length - 1];

		const GetNewPos = (directionCode) => {
			while (directionCode >= 10) directionCode = directionCode / 10;
			directionCode = Math.floor(directionCode);
			while (directionCode >= 4) directionCode -= 4;

			switch (directionCode) {
				case 0:
					return { x: lastPos.x, y: lastPos.y - 1 };
				case 1:
					return { x: lastPos.x + 1, y: lastPos.y };
				case 2:
					return { x: lastPos.x, y: lastPos.y + 1 };
				case 3:
					return { x: lastPos.x - 1, y: lastPos.y };
			}
		};

		let directionCodeStart = Math.random() * 10;

		for (let i = directionCodeStart; i <= directionCodeStart + 4; i++) {
			const newPos = GetNewPos(i);
			if (
				ls.cells[newPos.x] &&
				ls.cells[newPos.x][newPos.y] &&
				!ls.cells[newPos.x][newPos.y].word &&
				lettersPos.find(
					(pos) => newPos.x === pos.x && newPos.y === pos.y
				) === undefined
			)
				return newPos;
		}
		return false;
	};

	let colors = ["#fff"];
	let colorI = -1;
	WordsManager = [];
	let PlaceErrorCounter = 0;
	words.forEach((word) => {
		let StartPos = RandPos();
		colorI++;

		const PlaceWord = () => {
			let lettersPos = [];
			let letters = word.split("");
			while (ls.cells[StartPos.x][StartPos.y].word === true)
				StartPos = RandPos();
			StartPos.letter = letters[0];
			lettersPos.push(StartPos);
			letters.shift();

			let placeError = false;
			letters.forEach((letter) => {
				const pos = Move(lettersPos);
				if (!pos) {
					placeError = true;
				}
				pos.letter = letter;
				lettersPos.push(pos);
			});
			if (placeError) {
				console.error(word, "place error");
				PlaceErrorCounter++;
				if (PlaceErrorCounter >= 50) {
					NewPass(MAX_LETTERS + 2);
					RESTART = true;
					return "restart";
				}
				return false;
			}

			const randColor = `#${Math.floor(Math.random() * 10)}${Math.floor(
				Math.random() * 10
			)}${Math.floor(Math.random() * 10)}`;
			lettersPos.forEach((letterPos) => {
				ls.cells[letterPos.x][letterPos.y].word = true;
				ls.cells[letterPos.x][letterPos.y].letter = letterPos.letter;
				if (searchParams.get("debug")) {
					ls.cells[letterPos.x][letterPos.y].fontColor = randColor;
					colors[colorI] || "#fff";
					ls.cells[letterPos.x][letterPos.y].color = "#aaa";
				}
			});
			console.log(lettersPos);

			PlaceErrorCounter = 0;
			return lettersPos;
		};

		let lp;
		while (true) {
			lp = PlaceWord();

			if (lp === "restart") return "restart";
			if (lp) break;
		}
		const wm = { word: word, lp: lp };
		wm.ChangeColor = (color) =>
			wm.lp.forEach((letterPos) =>
				ls.cells[letterPos.x][letterPos.y].ChangeColor(color)
			);
		wm.ChangeFontColor = (color) =>
			wm.lp.forEach((letterPos) =>
				ls.cells[letterPos.x][letterPos.y].ChangeFontColor(color)
			);

		WordsManager.push(wm);
	});
	WordsCount = WordsManager.length;
};

let WordsManager = [];

let RESTART = false;

let RestartCounter = 0;

const GetLogicSharp = () => {
	lettersCount = 0;
	RESTART = false;
	WORDS.forEach((w) => (lettersCount += w.length));
	if (lettersCount >= (MAX_LETTERS + 1) * (MAX_LETTERS + 1))
		throw Error(
			`Too many words (${lettersCount}>=${
				(MAX_LETTERS + 1) * (MAX_LETTERS + 1)
			}).`
		);

	const ltrs = GenerateRandomLetters();
	const letters = ltrs.letters;

	const ls = {
		cells: [],
	};

	const ReDrow = () => {
		const FillCell = (cell, color) => {
			ctx.fillStyle = color || cell.color;
			ctx.fillRect(cell.x, cell.y, pass, pass);
			ctx.fillStyle = "#000";
		};

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ls.cells.forEach((x) => {
			x.forEach((cell) => {
				if (cell.color) {
					FillCell(cell);
				}
				if (cell.selected) FillCell(cell, "#aa0");
			});
		});
		DrawWords(ls.cells);
		DrawSharp();
	};

	let selected = [];
	let selectedWord = "";

	const cellsEmmiter = [];

	let XX = 0;
	for (let x = 0; x <= canvas.width; x += pass) {
		let YY = 0;
		ls.cells[XX] = [];
		cellsEmmiter[XX] = [];
		for (let y = 0; y <= canvas.height; y += pass) {
			const Emiter = CreateEventEmitter();
			cellsEmmiter[XX][YY] = Emiter;

			const cell = {
				x: x,
				y: y,
				letter: letters[XX][YY],
				color: undefined,
				fontColor: undefined,
				word: false,
				selected: false,
				on: Emiter.on,
				removeListener: Emiter.removeListener,
				onclick: undefined,
			};

			cell.ChangeColor = (newColor) => {
				cell.color = newColor;
				console.log("new color: " + newColor);
				ReDrow();
			};

			cell.ChangeFontColor = (newColor) => {
				cell.fontColor = newColor;
				console.log("new font color: " + newColor);
				ReDrow();
			};

			//selector
			cell.on("mousedown", () => {
				selectedWord = cell.letter;
				selected = [cell];
				cell.selected = true;
				ReDrow();
			})
				.on("mousemove", () => {
					if (IsMousedDown && !cell.selected) {
						cell.selected = true;
						selected.push(cell);
						selectedWord += cell.letter;
						ReDrow();
					}
				})
				.on("mouseup", () => {
					if (selected.length != 0) {
						console.log(selectedWord);
						selected.forEach((cell) => (cell.selected = false));

						WordsManager.forEach((wm) => {
							if (wm.word === selectedWord) {
								WordFoundHandler(wm);
							}
						});

						ReDrow();
					}
				});

			ls.cells[XX][YY] = cell;
			YY++;
		}
		XX++;
	}

	const GetMousePosition = (event) => {
		const X = Math.floor(event.layerX / pass);
		const Y = Math.floor(event.layerY / pass);
		return { X: X, Y: Y };
	};

	const GetCellEmmiter = (event) => {
		const pos = GetMousePosition(event);
		if (
			!cellsEmmiter[pos.X] ||
			!cellsEmmiter[pos.X][pos.Y] ||
			!cellsEmmiter[pos.X][pos.Y].emit
		)
			return () => {};
		return cellsEmmiter[pos.X][pos.Y].emit;
	};

	const canvasEvents = {
		click: (event) => {
			const emit = GetCellEmmiter(event);
			emit("click", event);
		},
		mousedown: (event) => {
			const emit = GetCellEmmiter(event);
			IsMousedDown = true;
			emit("mousedown", event);
		},
		mouseup: (event) => {
			const emit = GetCellEmmiter(event);
			IsMousedDown = false;
			emit("mouseup", event);
		},
		mousemove: (event) => {
			const emit = GetCellEmmiter(event);
			emit("mousemove", event);
		},
	};

	canvas.addEventListener("click", canvasEvents.click);
	canvas.addEventListener("mousedown", canvasEvents.mousedown);
	canvas.addEventListener("mouseup", canvasEvents.mouseup);
	canvas.addEventListener("mousemove", canvasEvents.mousemove);

	ls.Disponse = () => {
		canvas.removeEventListener("click", canvasEvents.click);
		canvas.removeEventListener("mousedown", canvasEvents.mousedown);
		canvas.removeEventListener("mouseup", canvasEvents.mouseup);
		canvas.removeEventListener("mousemove", canvasEvents.mousemove);
	};

	console.log(ls.cells);
	if (InsertWords(WORDS, ls) === "restart" || RESTART) {
		RestartCounter++;
		ls.Disponse();
		console.warn("restart", RestartCounter);
		if (RestartCounter >= 100) {
			console.error("======Restart Limit======");
			throw new Error("Restart Limit");
		}
		return GetLogicSharp();
	}

	ReDrow();

	USER.logs.restarts = RestartCounter;
	USER.img.started = canvas.toDataURL();

	RestartCounter = 0;
	return ls;
};

const DrawWords = (cells) => {
	let XX = 0;
	let YY = 0;
	for (let y = pass / 2; y <= canvas.height; y += pass) {
		for (let x = pass / 2; x <= canvas.width; x += pass) {
			ctx.font = `${pass}px serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			ctx.fillStyle = cells[XX][YY].fontColor;
			ctx.fillText(cells[XX][YY].letter || "A", x, y);
			ctx.fillStyle = "#000";
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
