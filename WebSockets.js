
var socket = new WebSocket('ws://node-red-ugoae-2021-05-27.mybluemix.net/ws/audioInput');

socket.onopen = function (event) {
    console.log('Conectado');
};
socket.onmessage = function (event) {
    var message = event.data;
    console.log(message);
};

socket.onclose = function (event) {
    console.log('Desconectado del WebSocket.');
};

var constraints = { audio: true };
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    var mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = function(e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function(e) {
        this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function(e) {
        var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        socket.send(blob);
    };

    mediaRecorder.start();

    setTimeout(function() {
        mediaRecorder.stop()
    }, 2000);
});

