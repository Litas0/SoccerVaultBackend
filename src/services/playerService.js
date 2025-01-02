import Player from '../models/player.js';

export const setPlayers = async ( teamId, players ) => {

    await Player.deleteMany({ team: teamId })
    const playersIds = players.map(async (player) => {
        if(player.id) {
            const savedPlayer = await new Player(player).save();
            return savedPlayer.id;
        }
        const newPlayer = new Player({
            team: teamId,
            name: player.name,
            surname: player.surname,
            position: player.position,
            number: player.number,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0
        });
        const savedPlayer = await newPlayer.save();
        return savedPlayer.id;
    })
    return playersIds
}

export default { 
    setPlayers
}