const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const teams = require('../teams/teams.controller');

let userDatabase = {};
//userId -> userData

//registra un nuevo usuario
const registerUser = (userName, password) =>{
       return new Promise (async (resolve, reject) =>{
              let hashedPwd = crypto.hashPasswordSync(password);
              let userId = uuid.v4();
              userDatabase[userId] = {
                     userName: userName,
                     password: hashedPwd,
              };
              await teams.bootstrapTeam(userId);
              resolve();
       });
    

}

const cleanUpUsers = () =>{
       return new Promise((resolve, reject) =>{
              userDatabase = {};
              resolve();
       });
}


const getUser = (userId) =>{
       return new Promise((resolve, reject) =>{
              resolve(userDatabase[userId]);
       });
}

//Comprueba si en la base de datos existe algun usuario con este nombre de usuario
const getUserIdFormUserName = (userName) => {

       return new Promise((resolve, reject) =>{
              for (let user in userDatabase) {
                     if (userDatabase[user].userName == userName) {
                            let userData = userDatabase[user];
                            userData.userId = user;
                            return resolve(userData);
                     }
              }

              reject('No users found');
       });
}

const checkUserCredentials = (userName, password) => {
       
       return new Promise(async (resolve, reject) => {
         //Comprobamos que el usuario existe en la "base de datos"
         let user = await getUserIdFormUserName(userName);
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
exports.getUserIdFormUserName = getUserIdFormUserName;
exports.cleanUpUsers = cleanUpUsers;