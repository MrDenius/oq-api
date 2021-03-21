const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(
	"1OjhMweuNkVYrk4Mw7Lcb-GCXLHQICtO9AhbzkXBT8sQ"
);

/**
 *
 * @param {Express.Response} res
 * @param {Express.Request} req
 */
module.exports.handler = (req, res) => {
	console.log(req.body);
	console.log(process.env);

	const USER = req.body;

	USER.type = USER.type || "find-words";

	let words = "";
	USER.words.forEach((word) => (words += word + ";"));
	let wordsFounded = "";
	USER.wordsFounded.forEach((word) => (wordsFounded += word + ";"));

	USER.words = words;
	USER.wordsFounded = wordsFounded;

	doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	})
		.then(() => {
			doc.loadInfo().then(() => {
				const sheet = doc.sheetsByTitle[USER.type];
				console.log(sheet.title);
				console.log(USER);
				sheet.addRow({
					name: USER.name,
					"time-start": USER.time.start,
					"time-end": USER.time.end,
					words: USER.words,
					"words-founded": USER.wordsFounded,
					// "img-started": USER.img.started,
					// "img-end": USER.img.end,
					logs: JSON.stringify(USER.logs),
				});
			});
		})
		.catch(console.error);
	res.send("");
};
