const findWords = require("../app/controllers/findWords");
const sendResult = require("../app/controllers/sendResult");

module.exports = (app) => {
	app.get("/findWords", findWords.handler);
	app.post("/sendResult", sendResult.handler);
};
