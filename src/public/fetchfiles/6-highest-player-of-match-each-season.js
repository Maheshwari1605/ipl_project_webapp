fetch('http://localhost:3000/highest_player_of_the_match')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let iplSeasons = Object.keys(data);
  
  let allPlayerOfTheMatchData = [];
  let playerOfMatchData = {};
  Object.entries(data).map((currentData)=>{
    playerOfMatchData['name'] = currentData[1].player;
    let highestAwardSeasonWise = [];
    iplSeasons.map((season)=>{
      if(currentData[0]==season){
        highestAwardSeasonWise.push(currentData[1].times_of_player_of_match);
      }else{
        highestAwardSeasonWise.push(" ");
      }
    });
    playerOfMatchData['data'] = highestAwardSeasonWise;
    allPlayerOfTheMatchData.push(playerOfMatchData);
    playerOfMatchData={};
  });

  Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      text: '6. HIGHEST PLAYER OF MATCH AWARDS PER SEASON',
      align: 'left'
    },
    xAxis: {
      categories: iplSeasons,
      title: {
        text: 'IPL SEASONS'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'NUMBER OF PLAYER OF MATCH AWARDS',
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
    series: allPlayerOfTheMatchData
  });
})
.catch((error)=>{
  console.log(error);
})