const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();

app.use(express.json({ extended: true }));
//app.use(express.urlencoded({ extended: true }));

const cli = require("cli");

const isDebug = !process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV;
process.env.PORT = process.env.PORT || 5656;

global.address = isProduction
	? "https://oq-api.herokuapp.com/"
	: `http://localhost:${process.env.PORT}/`;

const StartModules = () => {
	app.listen(process.env.PORT, () => {
		cli.ok(
			`Server started on ${global.address} with port ${process.env.PORT}`
		);
	});
};

require("./config/routers")(app);

StartModules();
