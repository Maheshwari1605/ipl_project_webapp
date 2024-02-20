fetch('http://localhost:3000/one_player_dismiss_by_another')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let batsmanBowlerPair = `BATSMAN : ${data.batsman}  BOWLER : ${data.bowler}`;
  let timesOfDismissal = data.times_of_dismissal;

  const chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 3,
        depth: 80,
        viewDistance: 100
      }
    },
    xAxis: {
      title:{
        text:'BATSMAN & BOWLER'
      }
      ,
      categories: [batsmanBowlerPair]
    },
    yAxis: {
      title: {
        text:'DISMISSAL TIMES'
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'DISMISSAL TIMES: {point.y}'
    },
    title: {
      text: '8. HIGHEST TIMES ONE PLAYER DISMISSED BY ANOTHER PLAYER',
      align: 'left'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        depth: 25
      }
    },
    series: [{
      data: [timesOfDismissal],
      colorByPoint: true
    }]
  });
  
  function showValues() {
    document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
    document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
    document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
  }
  
  showValues();
})
.catch((error)=>{
  console.log(error);
});