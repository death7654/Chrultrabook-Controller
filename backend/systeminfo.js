const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
//index.html cpu load
  ipcRenderer.on('cpu',(event,data) => {
  //console.log(data + " %");
  document.getElementById('cpuLoad').innerHTML = data.toFixed(0) + "%";
});
//index.html memory usage
  ipcRenderer.on('mem',(event, data) => {
  //console.log(data + " %");
  document.getElementById('ramPercentage').innerHTML = 100 - data.toFixed(0)+ "%";

});
//index.html cpu temperatures
  ipcRenderer.on('cpuTemp',(event,data) => {
  //console.log(data + " C");
  document.getElementById('cpuTemp').innerHTML = data + "°C";
});






