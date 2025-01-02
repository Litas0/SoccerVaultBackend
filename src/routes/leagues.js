import express from 'express';

import leagueService from '../services/leagueService.js';
import calendarService from '../services/calendarService.js';

const router = express.Router();

// GET all leagues
router.get('/', async (req, res) => {
    try {
        const list = await leagueService.getListOfLeagues();
        if (!list || list.length === 0) {
            return res.status(404).json({ message: 'No leagues found' });
        }
        res.json(list);
    } catch (error) {
        console.error('Error fetching leagues:', error);
        res.status(500).json({ message: 'An error occurred while fetching leagues' });
    }
});
// PUT new league
router.put('/', async (req, res) => {
    try {
        const { name, description, rematches, numberOfTeams, ownerId, ownerFullName } = req.body;
        
        if (!name || !description || rematches === undefined || !numberOfTeams || !ownerId || !ownerFullName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newLeague = await leagueService.addLeague(
            name, 
            description, 
            rematches,
            numberOfTeams,
            ownerId,
            ownerFullName
        );

        if (!newLeague) {
            return res.status(500).json({ message: 'Failed to create new league' });
        }

        res.status(201).json(newLeague);
    } catch (error) {
        console.error('Error creating new league:', error);
        res.status(500).json({ message: 'An error occurred while creating the league' });
    }
});
// GET a specific league by ID
router.get('/:id', async (req, res) => {
    const league = await leagueService.getLeagueById(req.params.id)
    if (!league) return res.status(404).json({ message: 'League not found' });
    res.json(league);
})
// GET league's made by user
router.get('/user/:id', async (req, res) => {
    const leagues = await leagueService.getLeaguesOfUser(req.params.id);
    if (!leagues) return res.status(404).json({ message: 'No leagues found' });
    res.json(leagues);
})
// GET a specific league's table
router.get('/:id/table', async (req, res) => {
    const table = await leagueService.getTable(req.params.id)
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
})
// GET a specific league completed matches
router.get('/:id/results', async (req, res) => {
    const results = await leagueService.getMatches(req.params.id, true)
    if (!results) return res.status(404).json({ message: 'Results not found' });
    res.json(results);
})
// GET a specific league upcoming matches
router.get('/:id/upcoming', async (req, res) => {
    const upcoming = await leagueService.getMatches(req.params.id, false)
    if (!upcoming) return res.status(404).json({ message: 'Results not found' });
    res.json(upcoming);
})
// PUT a specyfic league calendar
router.put('/:id/calendar', async (req, res) => {
    try {
        const league = await leagueService.getLeagueById(req.params.id);
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        const pairings = await calendarService.makePairings(league.teams, league.rematches);
        const calendar = await calendarService.createCalendar(pairings, req.params.id);
        const resolvedCalendar = await Promise.all(calendar);
        
        const leagueWithCalendar = await leagueService.addCalendar(req.params.id, resolvedCalendar);

        res.json(leagueWithCalendar);
    } catch (error) {
        console.error('Error creating calendar:', error);
        res.status(500).json({ message: 'An error occurred while creating the calendar' });
    }
});
// DELETE a specyfic league
router.delete('/:id', async (req, res) => {
    const remove = await leagueService.removeLeague(req.params.id)
    res.json({"message": `Removed league ${req.params.id}`});
})
export default router;
