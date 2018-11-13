// console.log("ok");
//
// const audioChunks = [];
// var mediaRecorder = null;
//
// function recordAudio(){
//
//   navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(stream => {
//     mediaRecorder = new MediaRecorder(stream);
//     mediaRecorder.start();
//     console.log("recording");
//
//     mediaRecorder.addEventListener("dataavailable", event => {
//       audioChunks.push(event.data);
//     });
//
//     mediaRecorder.addEventListener("stop", () => {
//       console.log("stopping");
//
//       const audioBlob = new Blob(audioChunks);
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       console.log("playing");
//
//       audio.play();
//     });
//   });
//
// }
//
// function stopRecording(){
//   mediaRecorder.stop();
// }
let timer = null;

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    // Start the counter
    minuteElement = document.getElementById("minutesCounter");
    secondElement = document.getElementById("secondsCounter");
    timer = setInterval(increaseCounter, 1000);

    document.getElementById("body").classList.toggle("red");
    document.getElementById("body").classList.toggle("bg-light-gray");

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
      console.log(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

let recorder = null;
let audio = null;

const recordStop = async () => {
  if (recorder) {

    clearInterval(timer);
    document.getElementById("body").classList.toggle("red");
    document.getElementById("body").classList.toggle("bg-light-gray");


    audio = await recorder.stop();
    recorder = null;
    document.querySelector("#record-stop-button").textContent = "Record";
    document.querySelector("#play-audio-button").removeAttribute("disabled");
  } else {
    recorder = await recordAudio();
    recorder.start();
    document.querySelector("#record-stop-button").textContent = "Stop";
  }
};

const playAudio = () => {
  console.log(audio);
  if (audio && typeof audio.play === "function") {
    audio.play();
  }
};

let counter = 0;
let minuteElement = null;
let secondElement = null;

// return n > 9 ? "" + n: "0" + n;

const increaseCounter = () => {
  counter = counter + 1;
  let seconds = counter % 60;
  secondElement.innerHTML = seconds > 9 ? "" + seconds: "0" + seconds;
  let minutes = Math.floor(counter/60);
  minuteElement.innerHTML = minutes > 9 ? "" + minutes: "0" + minutes;

}





// document.getElementById("record-stop-button").addEventListener ("click", recordAudio, false);
// document.getElementById("play-audio-button").addEventListener ("click", playAudio, false);
