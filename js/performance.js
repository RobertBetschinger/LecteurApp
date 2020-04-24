let myChart = document.getElementById("myChart").getContext("2d");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "#777";

function adddata(index) {
  index--;
  AntwortChart.data.datasets[0].data[index]++;
  AntwortChart.update();
}

function clearChart() {
  AntwortChart.data.datasets[0].data[0] = 0;
  AntwortChart.data.datasets[0].data[1] = 0;
  AntwortChart.data.datasets[0].data[2] = 0;
  AntwortChart.data.datasets[0].data[3] = 0;

  AntwortChart.update();
}

function changeLabels(question) {
  AntwortChart.data.labels[0] = question.antwort1;
  AntwortChart.data.labels[1] = question.antwort2;
  AntwortChart.data.labels[2] = question.antwort3;
  AntwortChart.data.labels[3] = question.antwort4;
  AntwortChart.update();

}
let AntwortChart = new Chart(myChart, {
  type: "horizontalBar",
  data: {
    labels: [
      "Antwortmöglichkeit-1:",
      "Antwortmöglichkeit-2:",
      "Antwortmöglichkeit-3:",
      "Antwortmöglichkeit-4:",
    ],
    datasets: [
      {
        label: "Anzahl",
        data: [0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderWidth: 2,
        borderColor: "#777",
        hoverBorderWidth: 3,
        hoverBorderColor: "#000",
        fontColor: "#ffffff",
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Live-Ergebnisse der Teilnehmer",
      fontSize: 25,
      fontColor: "white",
    },
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 5,
        right: 0,
        bottom: 0,
        top: 0,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "white",
          },

          display: true,
          gridLines: {
            display: false,
            color: "#FFFFFF",
          },
          labels: {
            fontColor: "#ffffff",
          },
          scaleLabel: {
            display: true,
            color: "#FFFFFF",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: "white",
          },
          display: true,
          gridLines: {
            display: true,
            color: "#FFFFFF",
          },
          scaleLabel: {
            display: true,
            color: "#FFFFFF",
          },
        },
      ],
    },
  },
});
