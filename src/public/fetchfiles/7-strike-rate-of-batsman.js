fetch('https://iplprojectmb.netlify.app/output/7-strike-rate-of-batsman-each-season.json')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let allBatsmanWithStrikeRate = [];
  let iplSeasons = [];
  let batsmanData = {};
  Object.entries(data).map((currentData)=>{
    Object.keys(currentData[1]).map((season)=>{
      if(iplSeasons.indexOf(season)===-1){
        iplSeasons.push(season);
      }
    });
  });
  iplSeasons.sort((firstSeason,secondSeason)=>{
    return firstSeason-secondSeason;
  });
  Object.entries(data).map((currentData)=>{
    batsmanData['name'] = currentData[0];
    let strikeRate = [];
    iplSeasons.map((season)=>{
      if(currentData[1][season]=== false){
        strikeRate.push(" ");
      }else{
        strikeRate.push(Number(currentData[1][season]));
      }
    });

    batsmanData['data'] = strikeRate;
    allBatsmanWithStrikeRate.push(batsmanData);
    batsmanData = {};
  });

  Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      text: '7. STRIKE RATE OF BATSMAN EACH SEASON',
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
        text: 'STRIKE RATE',
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
      layout: 'below',
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
    series: allBatsmanWithStrikeRate
  });
})
.catch((error)=>{
    console.log(error);
  });