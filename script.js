let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let SCALER = 0.6;
let SIZE = { x: 0, y: 0, width: 0, height: 0 };

async function main() {
    CANVAS = document.getElementById('myCanvas');
    CONTEXT = CANVAS.getContext('2d');
  
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 0) {
        const rearCamera = videoDevices[videoDevices.length - 1]; // Zakładając, że ostatnie urządzenie to kamera tylna
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: rearCamera.deviceId } });
        
        VIDEO = document.createElement('video');
        VIDEO.srcObject = stream;
        VIDEO.play();
  
        VIDEO.onloadeddata = function () {
          handleResize();
          window.addEventListener('resize', handleResize);
          updateCanvas();
        };
      } else {
        alert('No video devices found.');
      }
    } catch (err) {
      alert('Camera error: ' + err);
    }
  }

function handleResize() {
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  let resizer =
    SCALER *
    Math.min(
      window.innerWidth / VIDEO.videoWidth,
      window.innerHeight / VIDEO.videoHeight
    );
  SIZE.width = resizer * VIDEO.videoWidth;
  SIZE.height = resizer * VIDEO.videoHeight;
  SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
  SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
}

function updateCanvas() {
  CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
  window.requestAnimationFrame(updateCanvas);
}

// Wywołanie funkcji main przy załadowaniu strony
window.onload = main;






