//Matches per year
fetch('http://localhost:3000/matches-per-year')
.then((data) => {
  return data.json();
})
.then((data) => {
  let season = Object.keys(data);
  let numberOfMatches = Object.values(data);

  const chart = new Highcharts.Chart({
    chart: {
      renderTo: "container",
      type: "column",
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 3,
        depth: 100,
        viewDistance: 25,
      },
    },
    xAxis: {
      title: {
        text: "IPL SEASONS",
      },
      categories: season,
    },
    yAxis: {
      title: {
        text: "MATCHES PLAYED",
      },
    },
    tooltip: {
      headerFormat: "<b>{point.key}</b><br>",
      pointFormat: "Matches Played: {point.y}",
    },
    title: {
      text: "1. IPL MATCHES PER YEAR",
      align: "left",
    },
    series: [
      {
        data: numberOfMatches,
        colorByPoint: true,
      },
    ],
  });

  function showValues() {
      document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
      document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
      document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
    }


  showValues();
})
  .catch((error) => console.error("Error fetching data:", error));