const jwt = require("jsonwebtoken");
const usersController = require("./users.controller");
const {to} = require("../tools/to");

const loginUser = async (req, res) =>{
    if (!req.body) {
      return res.status(400).json({ message: "Missing data" });
    } else if (!req.body.user || !req.body.password) {
      return res.status(400).json({ message: "Missing data" });
    }

    //Comprobamos credenciales

    let [err, resp] = await to( usersController.checkUserCredentials(req.body.user,req.body.password))

    if (err || !resp) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    //si son validas generamos un JWT i lo devolvemos
    let user = await usersController.getUserIdFromUserName(req.body.user);
    const token = jwt.sign({ userId: user.userId }, "secretPassword");
    res.status(200).json({ token: token });
         
}

exports.loginUser = loginUser;
