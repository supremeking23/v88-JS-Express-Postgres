const EXPRESS = require("express");
const APP = EXPRESS();
const PORT = 8080;

let bodyParser = require("body-parser");
let session = require("express-session");
APP.use(bodyParser.urlencoded({ extended: true }));

APP.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
);

// for image/js/css
APP.use(EXPRESS.static(__dirname + "/assets"));
// This sets the location where express will look for the ejs views
APP.set("views", __dirname + "/views");
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
APP.set("view engine", "ejs");
// use app.get method and pass it the base route '/' and a callback

require("./routes.js")(APP);

// const DBCONNECTION = require("./config");
// APP.get("/", async function (req, res) {
// 	try {
// 		const users = await DBCONNECTION.any("SELECT * FROM users ");
// 		console.log(users);
// 		// success
// 	} catch (e) {
// 		// error
// 	}
// 	// res.send("loading");
// });

APP.listen(PORT);
