fetch('https://iplprojectmb.netlify.app/output/3-extra-runs-conceded-per-team-2016.json')
.then((data)=>{
  return data.json();
})
.then((data)=>{

  let teamList = Object.keys(data);
  let extraRunsConced = Object.values(data);

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
        text:'EXTRA RUNS CONCEDED'
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Extra runs: {point.y}'
    },
    title: {
      text: '3. EXTRA RUNS CONCEDED PER TEAM IN THE YEAR 2016',
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
      data: extraRunsConced,
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
})
