import Team from '../models/team.js';
import Player from '../models/player.js';

export const addTeam = async (
    league, 
    name, 
    description,
    stadionAdress,
) => {
    const newTeam = new Team({
        league,
        name,
        description,
        stadionAdress,
        players: []
    });
    const savedTeam = await newTeam.save();
    return savedTeam;
}

export const addPlayers = async (
    teamId,
    playersIds
) => {
    const team = await Team.findById(teamId);
    if (!team) return null;
    team.players = playersIds;
    const savedTeam = await team.save();
    return savedTeam;
}

export const getTeam = async (
    teamId
) => {
    const team = await Team.findById(teamId).populate('players');;
    if (!team) return null;
    return team;
}

export const updateTeam = async (
    teamId,
    updatedTeam
) => {
    const playerlessTeam = {...updatedTeam, players: []}
    const team = await Team.findByIdAndUpdate(teamId, playerlessTeam, { new: true });
    if (!team) return null;
    return team;
}

export const removeTeam = async (teamId) => {
    const team = await Team.findById(teamId)
        if (team.players) {
            team.players.map(async (playerId) => {
                await Player.findByIdAndDelete(playerId)
            })
        }     
        await Team.findByIdAndDelete(teamId)
}

export default { 
    addTeam,
    addPlayers,
    getTeam,
    updateTeam,
    removeTeam
}