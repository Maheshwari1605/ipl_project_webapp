fetch("https://iplprojectmb.netlify.app/output/2-matches-won-per-team-per-year.json")
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    let seasonList = [];
    Object.values(data).map((currentData) => {
      Object.keys(currentData).map((season) => {
        if (seasonList.indexOf(season) === -1) {
          seasonList.push(season);
        }
      });
    });
    seasonList.sort((firstSeason, secondSeason) => {
      return firstSeason - secondSeason;
    });
    
    let yearwisearray = [];
    let teamname = Object.keys (data);
    Object.values (data).forEach (each => {
      let arr = []
      seasonList.forEach (season => {
        if (each[season] === undefined) {
          arr.push(0)
        }else {
          arr.push(each[season])
        }
      })
      yearwisearray.push(arr)
    })
    console.log(yearwisearray);
    console.log(seasonList);
    console.log(teamname);

    // Substring template helper for the responsive labels
    Highcharts.Templating.helpers.substr = (s, from, length) =>
      s.substr(from, length);

    // Create the chart
    Highcharts.chart("container", {
  //     chart: {
  //       type: "heatmap",
  //       marginTop: 40,
  //       marginBottom: 80,
  //       plotBorderWidth: 1,
  //     },

  //     title: {
  //       text: "Matches won per team per year",
  //       style: {
  //         fontSize: "1em",
  //       },
  //     },

  //     xAxis: {
  //       categories: seasonList
  //     },

  //     yAxis: {
  //       categories: teamname,
  //       title: null,
  //       reversed: true,
  //     },

  //     accessibility: {
  //       point: {
  //         descriptionFormat:
  //           "{(add index 1)}. " +
  //           "{series.xAxis.categories.(x)} won " +
  //           "{series.yAxis.categories.(y)}, {value}.",
  //       },
  //     },

  //     colorAxis: {
  //       min: 0,
  //       minColor: "#FFFFFF",
  //       maxColor: Highcharts.getOptions().colors[0],
  //     },

  //     legend: {
  //       align: "right",
  //       layout: "vertical",
  //       margin: 0,
  //       verticalAlign: "top",
  //       y: 25,
  //       symbolHeight: 280,
  //     },

  //     tooltip: {
  //       format:
  //         "<b>{series.xAxis.categories.(point.x)}</b> matches in <br>" +
  //         "<b>{point.value}</b> won <br>" +
  //         "<b>{series.yAxis.categories.(point.y)}</b>",
  //     },

  //     series: [
  //       {
  //         name: "Matches won",
  //         borderWidth: 1,
  //         data: yearwisearray,
  //         dataLabels: {
  //           enabled: true,
  //           color: "#000000",
  //         },
  //       },
  //     ],

  //     responsive: {
  //       rules: [
  //         {
  //           condition: {
  //             maxWidth: 500,
  //           },
  //           chartOptions: {
  //             yAxis: {
  //               labels: {
  //                 format: "{substr value 0 1}",
  //               },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   });
  // })

  
    "chart": {
      "type": "heatmap",
      "plotBorderWidth": 1
    },
    "title": {
      "text": "Indian Premier League Team Performance (2008-2017)"
    },
    "xAxis": {
      "categories": seasonList
    },
    "yAxis": {
      "categories": teamname,
      "title": null
    },
    "colorAxis": {
      "min": 0,
      "minColor": '#FFFFFF',
      "maxColor": Highcharts.getOptions().colors[0]
    },
    "legend": {
      "align": 'right',
      "layout": 'vertical',
      "margin": 0,
      "verticalAlign": 'top',
      "y": 25,
      "symbolHeight": 280
    },
    "tooltip": {
      "formatter": function () {
        return '<b>' + this.series.yAxis.categories[this.point.y] + '</b> won <br><b>' +
          this.point.value + '</b> matches in <br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
      }
    },
    "series": [{
      "name": "Matches Won",
      "borderWidth": 1,
      "data": yearwisearray,
      "dataLabels": {
        "enabled": true,
        "color": '#000000'
      }
    }]
  })
})
  .catch((error) => console.error("Error fetching data:", error));
