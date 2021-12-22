let teamsDatabase = {};

const cleanUpTeam = () =>{
       return new Promise((resolve, reject) =>{
              for (let user in teamsDatabase) {
                teamsDatabase[user] = [];
              }

              resolve();
       })
       
}

const bootstrapTeam = (userId) => {
       return new Promise((resolve, reject) =>{
         teamsDatabase[userId] = [];
         resolve();     
       })
}

const addPokemon = (userId, pokemon) => {
       
       return new Promise((resolve, reject) => {
              console.log(teamsDatabase[userId].length);
              if(teamsDatabase[userId].length == 6){
                     reject('You already have 6 pokemon');
              }else{
                     teamsDatabase[userId].push(pokemon);
                     resolve();
              }
       }); 
       
}

const deletePokemonAt = (userId, index) => {

       return new Promise((resolve, reject) => {
              if(!teamsDatabase[userId][index]){
                     reject("This pokemon dosent exist");         
              }else{
                     teamsDatabase[userId].splice(index, 1);
                     resolve();
              }           
       })

       
}

const getTeamOfUser = (userId) => {
       return new Promise((resolve, reject) => {
              return resolve(teamsDatabase[userId]);
       });
}

const setTeam = (userId, team) =>{
       return new Promise((resolve, reject) =>{
              teamsDatabase[userId] = team;
              resolve();
       })
     
}

exports.bootstrapTeam = bootstrapTeam;
exports.setTeam = setTeam;
exports.addPokemon = addPokemon;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeam = cleanUpTeam;
exports.deletePokemonAt = deletePokemonAt;

