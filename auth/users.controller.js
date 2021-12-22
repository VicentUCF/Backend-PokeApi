const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const teams = require('../teams/teams.controller');
const mongoose = require('mongoose');
const UserModel = mongoose.model("userModel", { userName: String, password: String, userId: String });
const {to} = require('../tools/to');


let userDatabase = {};
//userId -> userData



//registra un nuevo usuario
const registerUser = (userName, password) =>{
       return new Promise (async (resolve, reject) =>{
              let hashedPwd = crypto.hashPasswordSync(password);
              let userId = uuid.v4();
              let newUser = new UserModel({
                     userId: userId,
                     userName: userName,
                     password: hashedPwd 

              });

              await newUser.save();
              await teams.bootstrapTeam(userId);
              resolve();
       });
    

}



const cleanUpUsers = () =>{
       return new Promise(async (resolve, reject) =>{
              await UserModel.deleteMany({}).exec(); 
              resolve();
       });
}


const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getUserIdFromUserName = (userName) => {
        return new Promise(async (resolve, reject) => {
            let [err, result] = await to(UserModel.findOne({userName: userName}).exec());
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
}

const checkUserCredentials = (userName, password) => {
       
       return new Promise(async (resolve, reject) => {
         //Comprobamos que el usuario existe en la "base de datos"
         let user = await getUserIdFromUserName(userName);
         //Si existe comprobaremos si la pwd es correcta
         if (user) {
           crypto.comparePassword(password, user.password, (err, result) => {
             if (err) {
               reject(err);
             } else {
               resolve(result);
             }
           });
         } else {
                console.log('missing');
           reject("Missing user");
         }


       });
       
}

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUser = getUser;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.cleanUpUsers = cleanUpUsers;