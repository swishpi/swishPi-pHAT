var trace1 = {
  x: [0],
  y: [0.0],
  mode: 'lines',
  line: {
      shape: "spline",
      smoothing: 0.5
  },
  name: 'T'
};

var trace2 = {
  x: [0],
  y: [0.0],
  mode: 'lines',
  line: {
      shape: "spline",
      smoothing: 0.5
  },
  name: 'H'
};


var dataTemp = [trace1];
var dataHumidity = [trace2];

var layoutT = {
  title: 'SI7020 Temperature live data',
  xaxis: {
    title: 'Time (s)'
  },
  yaxis: {
    title: 'Temp (deg C)'
  }
};

var layoutH = {
  title: 'SI7020 Humidity',
  xaxis: {
    title: 'Time (s)'
  },
  yaxis: {
    title: 'Humidity (% RH)'
  }
};

Plotly.newPlot('TempDiv', dataTemp, layoutT);
Plotly.newPlot('HumidityDiv', dataHumidity, layoutH);

window.WebSocket = window.WebSocket || window.MozWebSocket;

var connection = new WebSocket('ws://192.168.137.2:3001'); // Change to match your own DE10-Nano IP
var messagesPerSecond = 1; // Change to match your server data rate
var messagesReceived = 0;

connection.onopen = function () {
    // Connection is open
    console.log('Connection to websocket established...');
};

connection.onerror = function (error) {
    // Data error
    console.log('Error: ' + error.data);
};

connection.onmessage = function (message) {
    // Parse data and push data to plot
    try {
        var sensorData = JSON.parse(message.data); // Deserialize incoming JSON acceleration data

        // Divide the X axis by the number of messages received per second, so that major units are elapsed seconds
        var ts = messagesReceived/messagesPerSecond;

        var newDataT = {
            x: [[ts]],
            y: [[sensorData.temperature_C] ]
        }

		var newDataH = {
            x: [[ts]],
            y: [[sensorData.humidity] ]
        }
		
        // Extend the current graph, last integer here is the number of X values to keep before discarding old data
        Plotly.extendTraces('TempDiv', newDataT, [0], 20 * messagesPerSecond);
		Plotly.extendTraces('HumidityDiv', newDataH, [0], 20 * messagesPerSecond);
		
        messagesReceived++;
    } catch (e) {
        console.log('This doesn\'t look like valid JSON: ', message.data);
        return;
    }
};
