 const axios = require("axios").default;
 const teamsController = require("./teams.controller");
 const { getUser } = require("../auth/users.controller");
 const {to} = require("../tools/to");


 

const getTeamFromUser = async (req, res) => {
  let user = await getUser(req.user.userId);
  let [teamErr, team] = await to(
    teamsController.getTeamOfUser(req.user.userId)
  );
  if (teamErr) {
    return res.status(400).json({ message: err });
  }
  res.status(200).json({
    trainer: user.userName,
    team: team,
  });
};

 const setTeamToUser = (req, res) => {
   teamsController.setTeam(req.user.userId, req.body.team);
   res.status(200).send();
 };

const addPokemonToTeam = async (req, res) => {
  let pokemonName = req.body.name.toLowerCase();

  let [pokeApiError, pokeAapiResponse] = 
  await to(axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`));

  if (pokeApiError){
    return res.status(400).json({ message: pokeApiError });
  }

  let pokemon = {
    name: pokemonName,
    pokedexNumber: pokeAapiResponse.data.id,
  };

  let [errorAdd, response] = await to(teamsController.addPokemon(req.user.userId, pokemon));

  if (errorAdd){
     return res.status(400).json({ message: errorAdd });
  }

  res.status(201).json(pokemon);

};


const deletePokemonFromTeam = async (req, res) => {
  let [err, resp] = await to(
    teamsController.deletePokemonAt(req.user.userId, req.params.pokeid)
  );
  if(err) {
    return res.status(400).json({ message: err });
  }
  res.status(200).send();
};

 exports.getTeamFromUser = getTeamFromUser;
 exports.setTeamToUser = setTeamToUser;
 exports.addPokemonToTeam = addPokemonToTeam;
 exports.deletePokemonFromTeam = deletePokemonFromTeam;