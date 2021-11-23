import { mapData } from "./mapData.js";
import { updateOptionsData } from "./updateOptionsData.js";
import { historyHooks } from "./historyHooks.js";

async function getData() {
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4448/dados?formato=json');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(response.status);
    }
    const loading = document.querySelector('.loading');
    loading.remove();
    return data;
}


const mappedData = mapData(await getData());
let refreshDataChart = [];
let historyFilter = [];
let historyLabel = [];

const refreshMappedData = (posStart, posEnd, reset) => {
  refreshDataChart =
    refreshDataChart.length > 0
      ? refreshDataChart.slice(posStart, posEnd)
      : mappedData.slice(posStart, posEnd);

  if (reset) {
    refreshDataChart = mappedData;
  }

  if (historyFilter.length === 0) {
    historyHooks(historyFilter, myChart.data.datasets[0].data);
    historyHooks(historyLabel, myChart.data.labels);
  }
  if (myChart.data.datasets[0].data) {
    historyHooks(
      historyFilter,
      myChart.data.datasets[0].data.slice(posStart, posEnd)
    );
    historyHooks(historyLabel, myChart.data.labels.slice(posStart, posEnd));

    myChart.data.datasets[0].data = reset
      ? historyFilter.shift()[1]
      : historyFilter[historyFilter.length - 1][1];
    myChart.data.labels = reset
      ? historyLabel.shift()[1]
      : historyLabel[historyLabel.length - 1][1];
  }
  myChart.update();
};

const ctx = document.getElementById("myChart").getContext("2d");
const configChart = {
  type: 'line',
  data: {
    datasets: [
      {
        label: "inflação em %",
        data: mappedData,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    responsive: true,
    parsing: {
      xAxisKey: "mesAno",
      yAxisKey: "valor",
    },
  },
};
let myChart = new Chart(ctx, configChart);

const rangeDateOptions = () => {
  const selectForm = document.querySelectorAll("select");
  const loadedData =
    refreshDataChart.length > 0 ? refreshDataChart : mappedData;
  selectForm.forEach((elm) => {
    loadedData.forEach((data, index) => {
      let option = document.createElement("option");
      option.value = data.mesAno;
      option.label = data.mesAnoFormatado;
      option.text = data.mesAnoFormatado;
      if (elm.id === "finalDate") option.selected = !!loadedData.length;
      elm.appendChild(option);
    });

    addListenerFunc(elm);
  });
};

const addListenerFunc = (elm) => {
  elm.addEventListener("change", () => {
    const posStart = elm.id === "initialDate" ? elm.selectedIndex : 0;
    const posEnd =
      elm.id === "finalDate"
        ? elm.selectedIndex + 1
        : refreshDataChart.length > 0
        ? refreshDataChart.length
        : mappedData.length;
    updateOptionsData();

    refreshMappedData(posStart, posEnd);
    rangeDateOptions();
  });
};

document.getElementById("clearFilter").addEventListener("click", () => {
  refreshMappedData(0, mappedData.length, true);
  updateOptionsData();
  rangeDateOptions();
});

document.querySelectorAll("select").forEach((elm) => {
  elm.addEventListener("change", () => {
    addListenerFunc(elm);
  });
});
rangeDateOptions();
