const userModel = require("../models/users.model");
const { validateEmail } = require("../my_module/utilities")();
const { registrationValidation, loginValidation } = require("../my_module/validation")();
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Users {
	constructor() {}

	index(req, res) {
		res.render("index", {
			message: req.session.message != undefined ? req.session.message : undefined,
			form_errors: req.session.form_errors != undefined ? req.session.form_errors : undefined,
		});
		req.session.destroy();
	}

	async create(req, res) {
		try {
			// testing

			let form_error_array = registrationValidation(req.body, validateEmail);
			if (form_error_array.length > 0) {
				// req.session.form_errors = form_error_array;
				let form_error = {
					type: "register",
					errors: form_error_array,
				};
				// req.session.form_errors = form_error_array;
				req.session.form_errors = form_error;
				res.redirect("/");
				return false;
			}

			let user = await userModel.findByEmail(req.body.email);

			// console.log(findEmail);
			let message = {};
			if (user.length > 0) {
				//email already exist
				message.title = "error";
				message.content = "Error, email already in the database";
			} else {
				// hash password

				bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
					req.body.password = hash;

					let new_user = new userModel(req.body);
					let created_user = await userModel.create(new_user);

					console.log("return");
					console.log(created_user);
				});

				message.title = "success";
				message.content = "Success, a new user has been created";
			}

			req.session.message = message;
			res.redirect("/");
		} catch (error) {
			console.log(error);
		}
	}

	async login_process(req, res) {
		try {
			let form_error_array = loginValidation(req.body, validateEmail);

			if (form_error_array.length > 0) {
				let form_error = {
					type: "login",
					errors: form_error_array,
				};

				req.session.form_errors = form_error;
				res.redirect("/");
				return false;
			}

			let user = await userModel.findByEmail(req.body.email);

			if (user.length > 0) {
				bcrypt.compare(req.body.password, user[0].password, async function (err, result) {
					if (result) {
						console.log("correct credentials");

						req.session.user = user[0];
						res.redirect("/welcome");
					} else {
						console.log("wrong password");
						let form_error = {
							type: "login",
							errors: ["Incorrect Email or Password"],
						};

						req.session.form_errors = form_error;
						res.redirect("/");
						return false;
					}
				});
			} else {
				// wrone credentials
				let form_error = {
					type: "login",
					errors: ["Incorrect Email or Password"],
				};

				req.session.form_errors = form_error;
				res.redirect("/");
				return false;
			}
		} catch (error) {}
	}

	async welcome(req, res) {
		console.log(req.session.user);
		res.render("welcome", { user: req.session.user });
	}

	logoff(req, res) {
		req.session.destroy();
		res.redirect("/");
	}
}

module.exports = new Users();
