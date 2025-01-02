import express from 'express';

import calendarService from '../services/calendarService.js';

const router = express.Router();

// PUT date for match
router.put('/:roundId/:homeTeamName/date', async (req, res) => {
    const { date } = req.body;
    const match = await calendarService.setMatchDate(req.params.roundId, req.params.homeTeamName, date)
    res.json(match);
})
// PUT score for match
router.put('/:roundId/:homeTeamName/result', async (req, res) => {
    const { score } = req.body;
    const match = await calendarService.setMatchScore(req.params.roundId, req.params.homeTeamName, score)
    res.json(match);
})

export default router;