const GetView = require("./getView");

/**
 *
 * @param {Express.Response} res
 * @param {Express.Request} req
 */
module.exports.handler = (req, res) => {
	let html = GetView("findWords").value;

	res.send(html);
};
