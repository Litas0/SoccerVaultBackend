import express from 'express';

import leagueService from '../services/leagueService.js';
import calendarService from '../services/calendarService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const list = await leagueService.getListOfLeagues();
        if (!list || list.length === 0) {
            return res.status(404).json({ message: 'Nie znaleziono lig' });
        }
        res.json(list);
    } catch (error) {
        console.error('Błąd podczas pobierania lig:', error);
        res.status(500).json({ message: 'Błąd podczas pobierania lig' });
    }
});
router.put('/', async (req, res) => {
    try {
        const { name, description, rematches, numberOfTeams, ownerId, ownerFullName } = req.body;
        
        if (!name || !description || rematches === undefined || !numberOfTeams || !ownerId || !ownerFullName) {
            return res.status(400).json({ message: 'Brak wymganych pól' });
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
            return res.status(500).json({ message: 'Błąd podczas tworzenia ligi' });
        }

        res.status(201).json(newLeague);
    } catch (error) {
        console.error('Błąd podczas tworzenia ligi:', error);
        res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia ligi' });
    }
});
router.get('/:id', async (req, res) => {
    const league = await leagueService.getLeagueById(req.params.id)
    if (!league) return res.status(404).json({ message: 'Nie znaleziono ligi' });
    res.json(league);
})
router.get('/user/:id', async (req, res) => {
    const leagues = await leagueService.getLeaguesOfUser(req.params.id);
    if (!leagues) return res.status(404).json({ message: 'Nie znaleziono lig' });
    res.json(leagues);
})
router.get('/:id/table', async (req, res) => {
    const table = await leagueService.getTable(req.params.id)
    if (!table) return res.status(404).json({ message: 'Tabeli nie znaleziono' });
    res.json(table);
})
router.get('/:id/results', async (req, res) => {
    const results = await leagueService.getMatches(req.params.id, true)
    if (!results) return res.status(404).json({ message: 'Wyników nie znaleziono' });
    res.json(results);
})
router.get('/:id/upcoming', async (req, res) => {
    const upcoming = await leagueService.getMatches(req.params.id, false)
    if (!upcoming) return res.status(404).json({ message: 'Terminarza nie znaleziono' });
    res.json(upcoming);
})
router.put('/:id/calendar', async (req, res) => {
    try {
        const league = await leagueService.getLeagueById(req.params.id);
        if (!league) {
            return res.status(404).json({ message: 'Ligi nie znaleziono' });
        }

        const pairings = await calendarService.makePairings(league.teams, league.rematches);
        const calendar = await calendarService.createCalendar(pairings, req.params.id);
        const resolvedCalendar = await Promise.all(calendar);
        
        const leagueWithCalendar = await leagueService.addCalendar(req.params.id, resolvedCalendar);

        res.json(leagueWithCalendar);
    } catch (error) {
        console.error('Błąd w tworzeniu kalendarza:', error);
        res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia kalendarza' });
    }
});
router.delete('/:id', async (req, res) => {
    const remove = await leagueService.removeLeague(req.params.id)
    res.json({"message": `Usunięto ligę ${req.params.id}`});
})
export default router;
