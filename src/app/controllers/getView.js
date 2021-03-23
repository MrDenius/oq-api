const fs = require("fs");
const path = require("path");
module.exports = (view) => {
	const viewPath = path.join(__dirname, `../views/${view}/`);
	const viewFilePath = (filename) => path.join(viewPath, filename);

	console.log("View path: ", viewPath);

	let doc = {};

	if (fs.existsSync(viewFilePath("head.html")))
		doc.head = fs.readFileSync(viewFilePath("head.html"), "utf8");
	if (fs.existsSync(viewFilePath("body.html")))
		doc.body = fs.readFileSync(viewFilePath("body.html"), "utf8");
	if (fs.existsSync(viewFilePath("main.js")))
		doc.script = fs.readFileSync(viewFilePath("main.js"), "utf8");
	if (fs.existsSync(viewFilePath("styles.css")))
		doc.style = fs.readFileSync(viewFilePath("styles.css"), "utf8");

	doc.value = `<head>${doc.head || ""}<style>${
		doc.style || ""
	}</style></head><body>${doc.body || ""}<script type='text/javascript'>${
		doc.script || ""
	}</script></body>`;

	return doc;
};
