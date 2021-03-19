const findWords = require("../app/controllers/findWords");

module.exports = (app) => {
	app.get("/findWords", findWords.handler);
};
