
fetch('http://localhost:3000/matches_won_per_team_per_year')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let seasonList = [];
  Object.values(data).map((currentData)=>{
    Object.keys(currentData).map((season)=>{
      if(seasonList.indexOf(season) === -1){
        seasonList.push(season);
      }
    });
  });
  seasonList.sort((firstSeason,secondSeason)=>{
    return firstSeason-secondSeason;
  })

  let allTeamWithWinRecord = [];
  let teamData = {};
  Object.entries(data).map((currentData)=>{
    teamData['name'] = currentData[0];
    let highestAwardSeasonWise = [];
    seasonList.map((season)=>{
      if(currentData[1][season] === undefined){
        highestAwardSeasonWise.push("not played");
      }else{
        highestAwardSeasonWise.push(currentData[1][season]);
      }
    });
    teamData['data'] = highestAwardSeasonWise;
    allTeamWithWinRecord.push(teamData);
    teamData =  {};
  });
  Highcharts.chart('container', {
    chart: {
      type: 'bar'
    },
    title: {
      text: '2. MATCHES WON PER TEAM PER YEAR',
      align: 'left'
    },
    xAxis: {
      categories: seasonList,
      title: {
        text: 'IPL SEASONS'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'NUMBER OF MATCHES WON',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: allTeamWithWinRecord
  });
})
  .catch((error) => console.error("Error fetching data:", error));