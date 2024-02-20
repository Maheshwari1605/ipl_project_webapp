const fs = require("fs-extra");

const { parse } = require("csv-parse/sync");

function get_data() {
  const matches = new Promise((resolve, reject) => {
    fs.readFile("src/data/matches.csv", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsed_match_data = parse(data, {
          columns: true,
          skip_empty_lines: true,
        });

        resolve(parsed_match_data);
      }
    });
  });

  const deliveries = new Promise((resolve, reject) => {
    fs.readFile("src/data/deliveries.csv", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsed_delivery_data = parse(data, {
          columns: true,
          skip_empty_lines: true,
        });

        resolve(parsed_delivery_data);
      }
    });
  });

  Promise.all([matches, deliveries])
    .then((outcome) => {
      let matches = outcome[0];

      let deliveries = outcome[1];

      const result1 = matches_playedperyear(matches, deliveries);
      writeDataToJsonFile(result1,"src/public/output/1-matches-per-year.json");

      const result2 = matchesWonByTeamPerYearWise(matches, deliveries);
      writeDataToJsonFile(result2,"src/public/output/2-matches-won-per-team-per-year.json");

      const result3 = extraRunsConcededPerTeam(matches, deliveries);
      writeDataToJsonFile(result3,"src/public/output/3-extra-runs-conceded-per-team-2016.json");

      const result4 = top10EconomicalBowlers(matches, deliveries);
      writeDataToJsonFile(result4,"src/public/output/4-top-10-economical-bowlers-2015.json");

      const result5 = teamWonTossOwnMatch(matches, deliveries);
      writeDataToJsonFile( result5, "src/public/output/5-team-won-toss-won-match.json");

      const result6 = highestTimePlayerOfMatch(matches, deliveries);
      writeDataToJsonFile(result6,"src/public/output/6-highest-player-of-match-each-season.json");

      const result7 = strikeRateOfBatsmanSeasonWise(matches,deliveries);
      writeDataToJsonFile(result7,"src/public/output/7-strike-rate-of-batsman-each-season.json");

      const result8 = highestTimePlayerDismissal(matches, deliveries);
      writeDataToJsonFile(result8,"src/public/output/8-highest-times-one-player-dismmised-by-another-player.json");

      const result9 = economicalBowlerInSuperOvers(matches, deliveries);
      writeDataToJsonFile(result9,"src/public/output/9-best-economy-bowler-in-super-overs.json");
    })
    .catch((error) => {
      console.error(error);
    });
}

function matches_playedperyear(matches, deliveries) {
  let matchesPlayedPerYear = matches.reduce(
    (matchPlayedData, currentMatchData) => {
      let season = currentMatchData.season;

      if (matchPlayedData.hasOwnProperty(season)) {
        matchPlayedData[season] += 1;
      } else {
        matchPlayedData[season] = 1;
      }
      return matchPlayedData;
    },
    {}
  );
  return matchesPlayedPerYear;
}

function matchesWonByTeamPerYearWise(matches, deliveries) {
  let matchesWonPerTeamYearWise = matches.reduce(
    (matchesWonTeamData, currentMatchData) => {
      let season = currentMatchData.season;
      let winner = currentMatchData.winner;
      if (matchesWonTeamData.hasOwnProperty(winner)) {
        if (matchesWonTeamData[winner][season] !== undefined) {
          matchesWonTeamData[winner][season] += 1;
        } else {
          if (winner.trim() != "") {
            matchesWonTeamData[winner][season] = 1;
          }
        }
      } else {
        if (winner !== "") {
          matchesWonTeamData[winner] = {};
        }
        if (winner.trim() != "") {
          matchesWonTeamData[winner][season] = 1;
        }
      }
      return matchesWonTeamData;
    },
    {}
  );

  return matchesWonPerTeamYearWise;
}

function extraRunsConcededPerTeam(matches, deliveries) {
  let matchesPlayedIn2016 = matches.filter((match) => {
    return match.season === "2016";
  });

  let extraRunsPerTeam = {};

  matchesPlayedIn2016.map((match) => {
    deliveries.map((delivery) => {
      //Comparing the id for getting all the deliveries data of 2016.
      if (match.id === delivery.match_id) {
        if (extraRunsPerTeam.hasOwnProperty(delivery.bowling_team)) {
          extraRunsPerTeam[delivery.bowling_team] += Number(
            delivery.extra_runs
          );
        } else {
          extraRunsPerTeam[delivery.bowling_team] = Number(delivery.extra_runs);
        }
      }
    });
  });
  return extraRunsPerTeam;
}

function top10EconomicalBowlers(matches, deliveries) {
  //Get all the matches of season 2015
  let matchesPlayedIn2015 = matches.filter((match) => {
    return match.season === "2015";
  });

  let bowlersStat = {};

  matchesPlayedIn2015.map((match) => {
    deliveries.map((delivery) => {
      //Get all the delivery of  matches played in 2015
      if (match.id === delivery.match_id) {
        let bowlerName = delivery.bowler;
        let bowlerRunsConced =
          Number(delivery.total_runs) -
          Number(delivery.bye_runs) -
          Number(delivery.legbye_runs) -
          Number(delivery.penalty_runs);
        if (bowlersStat.hasOwnProperty(bowlerName)) {
          bowlersStat[bowlerName]["runs"] += bowlerRunsConced;
          //if the ball is noball or wide, don't increment the no of balls
          if (delivery.noball_runs === "0" && delivery.wide_runs === "0") {
            bowlersStat[bowlerName]["balls"] += 1;
            //Calculate the economy by using runs and number of balls
            bowlersStat[bowlerName]["economy"] = (
              (bowlersStat[bowlerName]["runs"] /
                bowlersStat[bowlerName]["balls"]) *
              6
            ).toFixed(2);
          }
        } else {
          bowlersStat[bowlerName] = {};
          bowlersStat[bowlerName]["runs"] = bowlerRunsConced;
          if (delivery.noball_runs === "0" && delivery.wide_runs === "0") {
            bowlersStat[bowlerName]["balls"] = 1;
            bowlersStat[bowlerName]["economy"] = (
              (bowlersStat[bowlerName]["runs"] /
                bowlersStat[bowlerName]["balls"]) *
              6
            ).toFixed(2);
          } else {
            bowlersStat[bowlerName]["balls"] = 0;
          }
        }
      }
    });
  });
  //It sorted the bowler stat based on economy
  let bowlersSortedStat = Object.entries(bowlersStat).sort(
    (firstBowlerData, secondBowlerData) => {
      return firstBowlerData[1].economy - secondBowlerData[1].economy;
    }
  );
  //For getting top 10 bowlers based on economy from that array
  let top10Bowler = bowlersSortedStat.slice(0, 10);

  return Object.fromEntries(top10Bowler);
}

function teamWonTossOwnMatch(matches, deliveries) {
  let teamStat = matches.reduce((teamWonTossOwnMatchData, currentMatchData) => {
    let tossWinner = currentMatchData.toss_winner;
    let winner = currentMatchData.winner;
    if (tossWinner === winner) {
      if (teamWonTossOwnMatchData.hasOwnProperty(winner)) {
        teamWonTossOwnMatchData[winner] += 1;
      } else {
        teamWonTossOwnMatchData[winner] = 1;
      }
    }
    return teamWonTossOwnMatchData;
  }, {});
  return teamStat;
}

function highestTimePlayerOfMatch(matches, deliveries) {
  let allPlayerOfMatchData = matches.reduce(
    (playerOfMatchSeasonWise, currentMatch) => {
      let season = currentMatch.season;
      let playerName = currentMatch.player_of_match;
      if (playerOfMatchSeasonWise.hasOwnProperty(season)) {
        if (playerOfMatchSeasonWise[season][playerName] !== undefined) {
          playerOfMatchSeasonWise[season][playerName] += 1;
        } else {
          playerOfMatchSeasonWise[season][playerName] = 1;
        }
      } else {
        playerOfMatchSeasonWise[season] = {};
        playerOfMatchSeasonWise[season][playerName] = 1;
      }
      return playerOfMatchSeasonWise;
    },
    {}
  );

  let topPlayerSeasonWise = {};

  for (const [season, playerOfMatchDataSeasonWise] of Object.entries(
    allPlayerOfMatchData
  )) {
    topPlayerSeasonWise[season] = {};
    //sorting the data season wise, 1st index in player data contain the times of player of the match
    let sortedPlayerOfMatchData = Object.entries(
      playerOfMatchDataSeasonWise
    ).sort((firstPlayerData, secondPlayerData) => {
      return secondPlayerData[1] - firstPlayerData[1];
    });
    //We sort the data in descending order,so 0 index contain the player data having maximum awards
    const [batsman, timesOfPlayerOfMatch] = sortedPlayerOfMatchData[0];
    topPlayerSeasonWise[season]["player"] = batsman;
    topPlayerSeasonWise[season]["times_of_player_of_match"] =
      timesOfPlayerOfMatch;
  }
  return topPlayerSeasonWise;
}

function strikeRateOfBatsmanSeasonWise(matches, deliveries) {
  let matchIdWithSeason = matches.reduce((storedMatchData, currentMatch) => {
    storedMatchData[currentMatch.id] = currentMatch.season;
    return storedMatchData;
  }, {});

  //Get all the batsman stat season wise
  let batsmanStatWithStrikeRate = deliveries.reduce(
    (batsmanDataPerSeason, currentDelivery) => {
      let batsmanName = currentDelivery.batsman;
      let batsmanRuns = currentDelivery.batsman_runs;
      let season = matchIdWithSeason[currentDelivery.match_id];
      /* creating object where the batsman name as key and the value is a object, in value object
              season as key and batsman stat as value*/
      if (batsmanDataPerSeason.hasOwnProperty(batsmanName)) {
        if (batsmanDataPerSeason[batsmanName][season] === undefined) {
          batsmanDataPerSeason[batsmanName][season] = {};
          batsmanDataPerSeason[batsmanName][season]["runs"] =
            Number(batsmanRuns);
          if (currentDelivery.wide_runs === "0") {
            batsmanDataPerSeason[batsmanName][season]["balls"] = 1;
            batsmanDataPerSeason[batsmanName][season]["strikeRate"] = (
              (batsmanDataPerSeason[batsmanName][season]["runs"] /
                batsmanDataPerSeason[batsmanName][season]["balls"]) *
              100
            ).toFixed(2);
          } else {
            batsmanDataPerSeason[batsmanName][season]["balls"] = 0;
          }
        } else {
          batsmanDataPerSeason[batsmanName][season]["runs"] +=
            Number(batsmanRuns);
          if (currentDelivery.wide_runs === "0") {
            batsmanDataPerSeason[batsmanName][season]["balls"] += 1;
            batsmanDataPerSeason[batsmanName][season]["strikeRate"] = (
              (batsmanDataPerSeason[batsmanName][season]["runs"] /
                batsmanDataPerSeason[batsmanName][season]["balls"]) *
              100
            ).toFixed(2);
          }
        }
      } else {
        batsmanDataPerSeason[batsmanName] = {};
        batsmanDataPerSeason[batsmanName][season] = {};
        batsmanDataPerSeason[batsmanName][season]["runs"] = Number(batsmanRuns);
        if (currentDelivery.wide_runs === "0") {
          batsmanDataPerSeason[batsmanName][season]["balls"] = 1;
          batsmanDataPerSeason[batsmanName][season]["strikeRate"] = (
            (batsmanDataPerSeason[batsmanName][season]["runs"] /
              batsmanDataPerSeason[batsmanName][season]["balls"]) *
            100
          ).toFixed(2);
        }
      }
      return batsmanDataPerSeason;
    },
    {}
  );

  let batsmanStrikeRatePerSeason = {};
  //Refactoring the object to show only the strike rate of each season with batsman name
  for (const [batsmanName, batsmanDataWithSeason] of Object.entries(
    batsmanStatWithStrikeRate
  )) {
    batsmanStrikeRatePerSeason[batsmanName] = {};
    for (const [season, batsmanStat] of Object.entries(batsmanDataWithSeason)) {
      batsmanStrikeRatePerSeason[batsmanName][season] = batsmanStat.strikeRate;
    }
  }
  return batsmanStrikeRatePerSeason;
}

function highestTimePlayerDismissal(matches, deliveries) {
  let dismissalData = {};
  deliveries.map((currentDelivery) => {
    if (
      currentDelivery.player_dismissed !== "" &&
      currentDelivery.dismissal_kind !== "run out"
    ) {
      /*Creating a key with batsman and bowler, if not present.
                If present then incrementing the value based on condition*/
      if (
        dismissalData.hasOwnProperty(
          currentDelivery.batsman + "|" + currentDelivery.bowler
        )
      ) {
        dismissalData[
          currentDelivery.batsman + "|" + currentDelivery.bowler
        ] += 1;
      } else {
        dismissalData[
          currentDelivery.batsman + "|" + currentDelivery.bowler
        ] = 1;
      }
    }
  });

  //Sorted the data by using times of dismissal present in 1st index
  let sortedData = Object.entries(dismissalData).sort(
    (firstData, secondData) => {
      return secondData[1] - firstData[1];
    }
  );

  //Store the first data of sorted array, splitting to get batsman and bowler name
  let [batsmanName, bowlerName] = sortedData[0][0].split("|");
  let playerDismissalData = {};

  playerDismissalData["batsman"] = batsmanName;
  playerDismissalData["bowler"] = bowlerName;
  playerDismissalData["times_of_dismissal"] = sortedData[0][1];

  return playerDismissalData;
}

function economicalBowlerInSuperOvers(matches, deliveries) {
  let bowlerStatInSuperOver = deliveries.reduce(
    (bowlersStat, currentDelivery) => {
      if (currentDelivery.is_super_over === "1") {
        let bowler = currentDelivery.bowler;
        let noballRuns = currentDelivery.noball_runs;
        let wideRuns = currentDelivery.wide_runs;
        let totalRuns =
          Number(currentDelivery.total_runs) -
          Number(currentDelivery.legbye_runs) -
          Number(currentDelivery.penalty_runs) -
          Number(currentDelivery.bye_runs);

        /*Creating object for bowler with key as bowler name and value as nested object,
                  where the value object contains the balls,runs and economy as property.*/
        if (bowlersStat.hasOwnProperty(bowler)) {
          bowlersStat[bowler]["runs"] += totalRuns;
          if (noballRuns === "0" && wideRuns === "0") {
            bowlersStat[bowler]["balls"] += 1;
            bowlersStat[bowler]["economy"] = (
              (bowlersStat[bowler]["runs"] / bowlersStat[bowler]["balls"]) *
              6
            ).toFixed(2);
          }
        } else {
          bowlersStat[bowler] = {};
          bowlersStat[bowler]["runs"] = totalRuns;
          if (noballRuns === "0" && wideRuns === "0") {
            bowlersStat[bowler]["balls"] = 1;
            bowlersStat[bowler]["economy"] = (
              (bowlersStat[bowler]["runs"] / bowlersStat[bowler]["balls"]) *
              6
            ).toFixed(2);
          } else {
            bowlersStat[bowler]["balls"] = 0;
          }
        }
      }
      return bowlersStat;
    },
    {}
  );
  //Sorting the bowler stat based on economy, 1st index contain a nested object where economy is a key.
  let sortedData = Object.entries(bowlerStatInSuperOver).sort(
    (firstBowlerStat, secondBolwerStat) => {
      return firstBowlerStat[1].economy - secondBolwerStat[1].economy;
    }
  );

  return sortedData[0];
}

function writeDataToJsonFile(result, address) {
  try {
    fs.outputJson(address, result, { spaces: 2 })
      .then(() => fs.readJson(address))
      .then()
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.log(err.stack);
  }
}

module.exports = get_data;
