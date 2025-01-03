import League from '../models/league.js';
import Team from '../models/team.js';
import Round from '../models/round.js';
import Player from '../models/player.js';

export const getListOfLeagues = async () => {
    const leagues = await League.find({});
    const mapedLeagues = leagues.map((league) =>
        {
            return {
                id: league.id,
                name: league.name,
                numberOfTeams: league.numberOfTeams,
                ownerId: league.ownerId,
                ownerFullName: league.ownerFullName,
                calendar: league.calendar
            }           
        }
    );
    return mapedLeagues
}

export const addLeague = async (
    name, 
    description, 
    rematches,
    numberOfTeams,
    ownerId,
    ownerFullName
) => {
    const newLeague = new League({
        name,
        description,
        rematches,
        numberOfTeams,
        ownerId,
        ownerFullName,
        teams: [],
        calendar: []
    });
    const savedLeague = await newLeague.save();
    return savedLeague;
}

export const getLeagueById = async (id) => {
    const league = await League.findById(id).populate(['teams','calendar']);
    if (!league) return null;
    return league;
}

export const getLeaguesOfUser = async (user) => {
    const leagues = League.find({ ownerId: user})
    if (!leagues) return null;
    return leagues;
}

export const addTeamToLeague = async (leagueId, teamId) => {
    const league = await League.findByIdAndUpdate(leagueId, { $push: { teams: teamId } }, { new: true });
    if (!league) return null;
    return league;
}

export const addCalendar = async (leagueId, calendar ) => {
    try {
        if (!leagueId || !calendar) {
            throw new Error('Brak wymaganych parametrów');
        }

        const league = await League.findByIdAndUpdate(
            leagueId, 
            { $set: { calendar } }, 
            { new: true, runValidators: true }
        ).populate(['teams', 'calendar']);

        if (!league) {
            throw new Error('Liga nie znaleziona');
        }

        return league;
    } catch (error) {
        console.error('Wystąpił błąd podczas dodawania kalendarza:', error);
        throw new Error(`Wystąpił błąd podczas dodawania kalendarza: ${error.message}`);
    }
}

export const removeLeague = async (leagueId) => {   
    const league = await League.findById(leagueId);
    if(league.teams){
        league.teams.map(async (teamId) => {
            const team = await Team.findById(teamId)
            if (team.players) {
                team.players.map(async (playerId) => {
                    await Player.findByIdAndDelete(playerId)
                })
            }     
            await Team.findByIdAndDelete(teamId)
        })
    }
    await Round.deleteMany({ league: leagueId })
    return await League.findByIdAndDelete(leagueId)
}

export const getTable = async (leagueId) => {
    const league = await League.findById(leagueId).populate(['teams','calendar']);
    if (!league) return null;
    let table = league.teams.map((team) => {
        let teamResults = {
            id: team.id,
            name: team.name,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalsDiff: 0,
            points: 0
        }
        league.calendar.forEach((round) => {
            round.matches.forEach((match) => {
                if(match.homeTeamId == teamResults.id && match.played){
                    teamResults.goalsFor += match.score.home;
                    teamResults.goalsAgainst += match.score.away;
                    if(match.score.home > match.score.away){
                        teamResults.wins++;
                    } else if(match.score.home < match.score.away){
                        teamResults.losses++;
                    } else {
                        teamResults.draws++;
                    }
                } else if(match.awayTeamId == teamResults.id && match.played){
                    teamResults.goalsFor += match.score.away;
                    teamResults.goalsAgainst += match.score.home;
                    if(match.score.home < match.score.away){
                        teamResults.wins++;
                    } else if(match.score.home > match.score.away){
                        teamResults.losses++;
                    } else {
                        teamResults.draws++;
                    }
                }
            })
        })
        teamResults.played = teamResults.wins + teamResults.draws + teamResults.losses
        teamResults.goalsDiff = teamResults.goalsFor - teamResults.goalsAgainst
        teamResults.points = (teamResults.wins * 3) + teamResults.draws;

        return teamResults;
    })
    table.sort((a,b) => b.points - a.points);
    return table;
}

export const getMatches = async (leagueId, played) => {
    const league = await League.findById(leagueId).populate(['teams','calendar']);
    if (!league) return null;
    const filteredCalendar = league.calendar.map((round) => {
        const mapedRound = round.matches.map((match) => {
            if(match.played === played) return match
            else return null
        }).filter((match) => match !== null)
        return mapedRound
    })
    return filteredCalendar
}

export default { 
    addLeague ,
    getListOfLeagues,
    getLeagueById,
    getLeaguesOfUser,
    addTeamToLeague,
    addCalendar,
    removeLeague,
    getTable,
    getMatches,
}