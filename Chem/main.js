var State = {
  "time": 0,
  "leftRotate": 0,
  "rightRotate": 0,
  "leftLift": 0,
  "rightLift": 0,
  "base": 0,
  "kun": {
    "others": {
      "lastOperation": 0
    },
    "environment": {
      "isWorkState": false,
      "display": "camera"
    },
    "leftArm": {
      "holding": undefined,
      "isEmpty": false,
      "operationHistory": [],
      "isObserved": false
    },
    "rightArm": {
      "holding": undefined,
      "isEmpty": false,
      "operationHistory": [],
    },
  }
}

Experiments = [
  [
    "leftHandGetTube",
    "rightHandGetTube",
    "leftHandReachOutGetNaOH",
    "dropNaOH", // With parameter, 0-3@0.5
    "leftHandFinishGetNaOH",
    "rightHandReachOutGetNaOH",
    "dropNaOH", // With parameter, 0-3@0.5
    "rightHandFinishGetNaOH",
    "turnToExperimentArea",
    "mixNaOHCuSO4",
    // "HDCameraBeginWatchTube",
    // "HDCameraEndWatchTube",
    "turnToExperimentArea",
    "leftHandHandBackTube",
    "rightHandHandBackTube"
  ],
  [
    "rightHandGetBeaker",
    "rightHandReachOutGetHCl",
    "dropHCl", // With parameter, 0-3@0.5
    "rightHandFinishGetHCl",
    "rightHandReachOutGetCaCO3",
    "rightHandFinishGetCaCO3SeeHDCamera",
    "rightHandFinishHDCameraThermal",
    "rightHandHandBackBeaker",
  ],
  [
    "leftHandGetErlenmeyerFlask",
    "leftHandHandErlenmeyerFlask",
    "shake", // Custom
    "rotatePipeValve",
    "rightHandStartObservePipe",
    "rightHandObservePipe", // Currently unavailable
    "rightHandStopObservePipe"
  ]
]

/*
0  -> 30
40 -> 35
45 -> 40 
51 -> 45
59 -> 50
65 -> 55
75 -> 60
45 -> 临界值
*/

function socketInit() {
  console.log("CALLED:\tsocketInit");
  // var socket = new WebSocket("ws://192.168.1.3:2501");
  var socket = new WebSocket("ws://localhost:11451");
  return socket;
}

function socketSend(_message) {
  console.log("CALLED:\tsocketSend");
  socket.send(_message);
}

function socketSendList(_messageList) {
  console.log("CALLED:\tsocketBatchSend");
  for (var i = 0; i < length(_messageList); i++) {
    console.log("DEBUG:\tSending " + _messageList[i]);
    socketSend(_messageList[i]);
  }
}

function socketSendStrList(_messageTextList) {
  var list = _messageTextList.split("\n");
  socketSendList(list);
}

socket = socketInit();

// function loadLocalization(lang) {
//   console.log("CALLED:\tloadLocalization")
//   if (lang == "zh-CN" || lang == "Chinese Simplified") {
//     window.strings = JSON.parse("Localization/zh-CN.json");
//   } else if (lang == "en-US" || lang == "English (United States)") {
//     window.strings = JSON.parse("Localization/en-US.json");
//   }
// }
