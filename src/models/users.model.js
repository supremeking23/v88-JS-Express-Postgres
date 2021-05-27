const dbConnection = require("../config");

let user = function (user) {
	this.first_name = user.firstname;
	this.last_name = user.lastname;
	this.email = user.email;
	this.password = user.password;
	this.created_at = new Date();
	// this.updated_at = new Date();
};

//? using .then chain
// user.create = function (newUser) {
// 	return dbConnection.one("INSERT INTO users (first_name,last_name,email,password,created_at) VALUES ($1,$2,$3,$4,$5)", [
// 		newUser.first_name,
// 		newUser.last_name,
// 		newUser.email,
// 		newUser.password,
// 		newUser.created_at,
// 	])
// 		.then((data) => {
// 			console.log(data.id);
// 			return data.id;
// 		})
// 		.catch((error) => {
// 			console.log("ERROR:", error); // print error;
// 		});
// };

// ?using async await
user.create = async function (newUser) {
	const user = await dbConnection.any("INSERT INTO users (first_name,last_name,email,password,created_at) VALUES ($1,$2,$3,$4,$5)", [
		newUser.first_name,
		newUser.last_name,
		newUser.email,
		newUser.password,
		newUser.created_at,
	]);

	return user;
};

user.findAll = function (result) {
	dbConnection.query("SELECT * FROM express_users.users", function (err, res) {
		if (err) {
			// return err;

			result(null, err);
		} else {
			result(null, res);
		}
	});
};

// ?using async await
user.findByEmail = async function (email) {
	const user = await dbConnection.any("SELECT * FROM users WHERE email = $1 ", [email]);
	return user;
};

module.exports = user;
