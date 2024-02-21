fetch('https://iplprojectmb.netlify.app/output/9-best-economy-bowler-in-super-overs.json')
.then((data)=>{
  return data.json();
})
.then((data)=>{
  
  let bowler = data[0];
  let economy = Number(data[1].economy);

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
        text:'BOWLER'
      }
      ,
      categories: [bowler]
    },
    yAxis: {
      title: {
        text:'ECONOMY RATE'
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'ECONOMY RATE: {point.y}'
    },
    title: {
      text: '9. BEST ECONOMY BOWLER IN SUPER OVERS',
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
      data: [economy],
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
