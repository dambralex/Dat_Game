self.importScripts("pathfinding.js");

onmessage = function(e) {
  //console.log('Message received from main script');
  var workerResult = getPath(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5] * e.data[7], e.data[6] * e.data[7], e.data[7]);
  //console.log('Posting message back to main script');
  postMessage(workerResult);
}
