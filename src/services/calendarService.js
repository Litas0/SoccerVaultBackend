import Round from '../models/round.js'

export const makePairings = (teams, rematches) => {
    if (teams.length % 2 == 1) {
        teams.push(null);
    }
  
    const teamsCount = teams.length;
    const rounds = teamsCount - 1;
    const half = teamsCount / 2;
  
    const calendar = [];
  
    const teamsIndexes = teams.map((_, i) => i).slice(1);
  
    for (let round = 0; round < rounds; round++) {
      const roundPairings = [];
  
      const newteamsIndexes = [0].concat(teamsIndexes);
  
      const firstHalf = newteamsIndexes.slice(0, half);
      const secondHalf = newteamsIndexes.slice(half, teamsCount).reverse();
  
      for (let i = 0; i < firstHalf.length; i++) {
        roundPairings.push({
          home: teams[firstHalf[i]],
          away: teams[secondHalf[i]],
        });
      }
      teamsIndexes.push(teamsIndexes.shift());
      calendar.push(roundPairings);
    }
    if (rematches)
    {
      const teamsIndexes = teams.map((_, i) => i).slice(1);
      for (let round = 0; round < rounds; round++) {
        const roundPairings = [];
    
        const newteamsIndexes = [0].concat(teamsIndexes);
    
        const firstHalf = newteamsIndexes.slice(0, half);
        const secondHalf = newteamsIndexes.slice(half, teamsCount).reverse();
    
        for (let i = 0; i < firstHalf.length; i++) {
          roundPairings.push({
            away: teams[firstHalf[i]],
            home: teams[secondHalf[i]],
          });
        }
        teamsIndexes.push(teamsIndexes.shift());
        calendar.push(roundPairings);
      }
    }
  
    return calendar;
}

export const createCalendar = async (pairings, leagueId) => {
  try {
    const calendar = await Promise.all(
      pairings.map(async (r, index) => {
        try {
          const round = new Round({
            league: leagueId,
            number: ++index,
            matches: r
              .filter((m) => m.home && m.away)
              .map((m) => {
                if (!m.home || !m.away) {
                  throw new Error("Invalid match data: home or away team is missing.");
                }
                return {
                  homeTeamId: m.home.id,
                  homeTeamName: m.home.name,
                  awayTeamId: m.away.id,
                  awayTeamName: m.away.name,
                  place: m.home.stadionAdress,
                  played: false,
                };
              }),
          });
          const savedRound = await round.save();
          return savedRound.id;
        } catch (error) {
          console.error(`Error processing round ${index}:`, error);
          throw new Error(`Failed to create round ${index}: ${error.message}`);
        }
      })
    );
    return calendar;
  } catch (error) {
    console.error("Error creating calendar:", error);
    throw new Error(`Calendar creation failed: ${error.message}`);
  }
};

export const setMatchDate = async (roundId, homeTeamName, date) => {
  const round = await Round.findById(roundId);
  if (!round) throw new Error('Round not found');
  const matchIndex = await round.matches.findIndex((match) => match.homeTeamName === homeTeamName);
  round.matches[matchIndex].date = date
  const savedRound = await round.save()
  return savedRound.matches[matchIndex]
}

export const setMatchScore = async (roundId, homeTeamName, score) => {
  const round = await Round.findById(roundId);
  if (!round) throw new Error('Round not found');
  const matchIndex = await round.matches.findIndex((match) => match.homeTeamName === homeTeamName);
  round.matches[matchIndex].score = score
  round.matches[matchIndex].played = true
  const savedRound = await round.save()
  return savedRound.matches[matchIndex]
}

export default { 
    createCalendar,
    makePairings,
    setMatchDate,
    setMatchScore
}