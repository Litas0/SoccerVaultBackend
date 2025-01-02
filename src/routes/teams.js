import express from 'express';

import leagueService from '../services/leagueService.js';
import teamService from '../services/teamService.js';
import playerService from '../services/playerService.js';

const router = express.Router();


// Pobierz daną drużyne
router.get('/:id', async (req, res) => {
    const team = await teamService.getTeam(req.params.id); 
    res.json(team)
})
// Dodaj nową drużyne
router.put('/', async (req, res) => {
    const { league, name, description, stadionAdress, players } = req.body;
    const newTeam = await teamService.addTeam(
        league,
        name, 
        description, 
        stadionAdress
    )
    const playersIdsList = await playerService.setPlayers(
        newTeam.id,
        players
    )
    await leagueService.addTeamToLeague(league,newTeam.id)
    const resolvedPlayerIds = await Promise.all(playersIdsList);
    const teamFinal = await teamService.addPlayers(newTeam.id, resolvedPlayerIds)
    res.json(teamFinal)
})
// Zaktualizuj daną drużyne
router.put('/:id', async (req, res) => {
    const { id, players } = req.body
    const updatedTeam = await teamService.updateTeam(
        id,
        req.body
    )
    const newPlayersIdsList = await playerService.setPlayers(
        updatedTeam.id,
        players
    )
    const resolvedPlayerIds = await Promise.all(newPlayersIdsList);
    const teamFinal = await teamService.addPlayers(id, resolvedPlayerIds)
    res.json(teamFinal)
})
// Usuń daną drużyne
router.delete('/:id', async (req, res) => {
    const remove = await teamService.removeTeam(req.params.id)
    res.json({"message": `Usunięto drużyne ${req.params.id}`});
})
export default router