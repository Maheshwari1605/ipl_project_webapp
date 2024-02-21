fetch('https://iplprojectmb.netlify.app/output/4-top-10-economical-bowlers-2015.json')
.then((data)=>{
  return data.json();
})
.then((data)=>{
  
  let bowlerList = Object.keys(data);
  let bowlersEconomy = [];
  Object.values(data).map((bowler)=>{
    bowlersEconomy.push(parseFloat(bowler.economy));
  });

  const chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      type: 'column',
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
        text:'BOWLERS'
      }
      ,
      categories: bowlerList
    },
    yAxis: {
      title: {
        text:'ECONOMY RATES'
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Economy rate: {point.y}'
    },
    title: {
      text: '4. TOP 10 ECONOMICAL BOWLERS IN THE YEAR 2015',
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
      data: bowlersEconomy,
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
