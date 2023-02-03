const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const scanWifi = document.querySelector('#scanWifi');
const scanIp = document.querySelector('#scanIp');
const EvilScan= document.querySelector('#EvilScan');
const Camera= document.querySelector('#camera');
const Route= document.querySelector('#routes');
// const EvilScan= document.querySelector('#CameraLive');

function scanWifiNetworks() {
  // ipcRenderer.send('wifi:scan');
  console.log('scan wifi networks');
  ipcRenderer.send('scan:wifi');
}

function scanIpNetwork() {
  // ipcRenderer.send('wifi:scan');
  console.log('scan IP networks');
  ipcRenderer.send('scanIp:ip');
}
function evilscan() {
  // ipcRenderer.send('wifi:scan');
  console.log('EvilScan');
  ipcRenderer.send('EvilScan');
}
function camera() {
  // ipcRenderer.send('wifi:scan');
  console.log('camera');
  ipcRenderer.send('camera');
}

// Load image and show form
function route () {
  console.log('Route');
  ipcRenderer.send('Routes');
}

// Make sure file is an image
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
}



// When done, show message
ipcRenderer.on('image:done', () =>
  alertSuccess(`Image resized to ${heightInput.value} x ${widthInput.value}`)
);

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}




ipcRenderer.on('data', (event, data) => {
  //document.getElementById('data').innerHTML = data;
});

// File select listener
// img.addEventListener('change', loadImage);
// Form submit listener
// Scan wifi listener
scanWifi.addEventListener('click', scanWifiNetworks);
scanIp.addEventListener('click', scanIpNetwork);
EvilScan.addEventListener('click',evilscan);
Camera.addEventListener('click',camera);
Route.addEventListener('click',route);


ipcRenderer.on('scan:wifi', (event, data) => {
  // display the data in the main window
  ipcRenderer.send('return');
  document.getElementById('scanWifi').innerHTML = "<p>data</p>";

});

ipcRenderer.on('scanIp:ip', (event, data) => {
  // display the data in the main window
  ipcRenderer.send('return');
  // document.getElementById('scanIp').innerHTML = "<p>data</p>";

});

ipcRenderer.on('EvilScan:output', (event, data) => {
  // display the data in the main window
  ipcRenderer.send('return');
  document.getElementById('EvilScan').innerHTML = "<p>data</p>";

});

ipcRenderer.on('Routes:output', (event, data) => {
  // display the data in the main window
  ipcRenderer.send('return');
  console.log("IM CALLED");
  document.getElementById('Routes').innerHTML = "<p>data</p>";

});

ipcRenderer.on('CameraLive', (event, data) => {
  // display the data in the main window
  ipcRenderer.send('return');
  document.getElementById('EvilScan').innerHTML = "<p>data</p>";

});



