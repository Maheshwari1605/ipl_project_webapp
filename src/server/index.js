const express = require("express");
const app = express();
const cors = require ("cors")
const matches_per_year = require("../public/output/1-matches-per-year.json");
const matches_won_per_team_per_year = require("../public/output/2-matches-won-per-team-per-year.json");
const extra_run_conceeded = require("../public/output/3-extra-runs-conceded-per-team-2016.json");
const top_10_economical_bowler = require("../public/output/4-top-10-economical-bowlers-2015.json");
const team_won_toss_match = require("../public/output/5-team-won-toss-won-match.json");
const highest_player_of_the_match = require("../public/output/6-highest-player-of-match-each-season.json");
const strike_rate_of_the_batsman = require("../public/output/7-strike-rate-of-batsman-each-season.json");
const one_player_dismiss_by_another = require("../public/output/8-highest-times-one-player-dismmised-by-another-player.json");
const best_economy_in_superover = require("../public/output/9-best-economy-bowler-in-super-overs.json");
const port  = process.env.PORT || 3000
function isEmpty(data) {
    if (!data) {
      return true;
    }
    if (Array.isArray(data)) {
      if (data.length == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (Object.entries(data).length == 0) {
        return true;
      } else {
        false;
      }
    }
  }
  
  let getApi = (err, data) => {
    return tryCatch((req, res) => {
      if (isEmpty(data)) {
        throw new Error(err);
      }
      res.status(200).json(data);
    })
  }
  
  app.use (cors())


app.get('/matches-per-year', (req, res) => {
    res.json (matches_per_year)
})

app.get('/matches_won_per_team_per_year', (req, res) => {
    res.json (matches_won_per_team_per_year)
})

app.get('/extra_run_conceeded', (req, res) => {
    res.json (extra_run_conceeded)
})

app.get('/top_10_economical_bowler', (req, res) => {
    res.json (top_10_economical_bowler)
})

app.get('/team_won_toss_match', (req, res) => {
    res.json (team_won_toss_match)
})

app.get('/highest_player_of_the_match', (req, res) => {
    res.json (highest_player_of_the_match)
})

app.get('/strike_rate_of_the_batsman', (req, res) => {
    res.json (strike_rate_of_the_batsman)
})

app.get('/one_player_dismiss_by_another', (req, res) => {
    res.json (one_player_dismiss_by_another)
})

app.get('/best_economy_in_superover', (req, res) => {
    res.json (best_economy_in_superover)
})


app.listen(port, ()=>{
    console.log(`Port is listening at ${port}`)
})
