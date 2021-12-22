const mongoose = require("mongoose");
const { to } = require("../tools/to");
const TeamsModel = mongoose.model("TeamsModel", {
  userId: String,
  team: [],
});

const cleanUpTeam = () => {
  return new Promise((resolve, reject) => {
    TeamsModel.deleteMany({}).exec();
    resolve();
  });
};

const bootstrapTeam = (userId) => {
  return new Promise(async (resolve, reject) => {
    let newTeam = new TeamsModel({
      userId: userId,
      team: [],
    });
    await newTeam.save();
    resolve();
  });
};

const addPokemon = (userId, pokemon) => {
  return new Promise(async (resolve, reject) => {
    let [err, dbTeam] = await to(TeamsModel.findOne({ userId: userId }).exec());

    if (err) {
      return reject(err);
    }

    if (dbTeam.team.length == 6) {
      return reject("You already have 6 pokemon");
    } else {
      dbTeam.team.push(pokemon);
      await dbTeam.save();
      resolve();
    }
  });
};

const deletePokemonAt = (userId, index) => {
  return new Promise(async (resolve, reject) => {
    let [err, dbTeam] = await to(TeamsModel.findOne({ userId: userId }).exec());
    console.log(dbTeam);
    if (err || !dbTeam) {
      return reject(err);
    }
    if (dbTeam.team[index]) {
      dbTeam.team.splice(index, 1);
      console.log(dbTeam.team);
    }
    await dbTeam.save();
    resolve();
  });
};

const getTeamOfUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let teams = await TeamsModel.find({}).exec();
    let [err, dbTeam] = await to(TeamsModel.findOne({ userId: userId }).exec());
    if (err) {
      return reject(err);
    }
    resolve(dbTeam.team);
  });
};

const setTeam = (userId, team) => {
  return new Promise(async (resolve, reject) => {
    let [err, dbTeam] = await to(TeamsModel.findOne({ userId: userId }).exec());

    if (err) {
      return reject(err);
    }
    dbTeam.team = team;
    await dbTeam.save();
    resolve();
  });
};

exports.bootstrapTeam = bootstrapTeam;
exports.setTeam = setTeam;
exports.addPokemon = addPokemon;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeam = cleanUpTeam;
exports.deletePokemonAt = deletePokemonAt;
