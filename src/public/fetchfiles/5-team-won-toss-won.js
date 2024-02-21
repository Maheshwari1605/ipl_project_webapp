fetch('https://iplprojectmb.netlify.app/output/5-team-won-toss-won-match.json')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let teamList = Object.keys(data);
  let wonTossWonMatchTimes = Object.values(data);

  const chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      type: 'bar',
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 3,
        depth: 100,
        viewDistance: 25
      }
    },
    xAxis: {
      title:{
        text:'IPL TEAMS'
      }
      ,
      categories: teamList
    },
    yAxis: {
      title: {
        text:'WON TOSS OWN MATCH TIMES'
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Times: {point.y}'
    },
    title: {
      text: '5. TEAM WON TOSS WON MATCH',
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
      data: wonTossWonMatchTimes,
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