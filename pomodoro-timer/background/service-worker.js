let timerInterval;
let seconds = 25 * 60;
let timerIsRunning = false;

function startTimer() {
  if (!timerIsRunning) {
    timerIsRunning = true;
    timerInterval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
        chrome.storage.local.set({ seconds, timerIsRunning });
      } else {
        clearInterval(timerInterval);
        timerIsRunning = false;
        chrome.storage.local.set({ timerIsRunning });
        createNotification("Your Timer has ended :)");
        chrome.contextMenus.update("start-timer", {
          title: "Start Timer",
        });
      }
    }, 1000);
  }
}

function pauseTimer() {
  if (timerIsRunning) {
    timerIsRunning = false;
    clearInterval(timerInterval);
    chrome.storage.local.set({ timerIsRunning });
  }
}

function resetTimer() {
  seconds = 25 * 60;
  timerIsRunning = false;
  clearInterval(timerInterval);
  chrome.storage.local.set({ seconds, timerIsRunning });
  chrome.contextMenus.update("start-timer", {
    title: "Start Timer",
  });
}

function createNotification(message) {
  chrome.notifications.create({
    type: "list",
    title: "Pomo-Focus",
    message: message,
    items: [{ title: "Pomo-Focus", message: message }],
    iconUrl: "../icons/clock-9-16.png",
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    startTimer();
    chrome.contextMenus.update("start-timer", {
      title: "Stop Timer",
    });
  } else if (request.action === "pause") {
    pauseTimer();
    chrome.contextMenus.update("start-timer", {
      title: "Start Timer",
    });
  } else if (request.action === "reset") {
    resetTimer();
  }
  sendResponse({ status: "done" });
});

// Context Menu Setup
function createContextMenus() {
  chrome.contextMenus.create({
    id: "start-timer",
    title: "Start Timer",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset Timer",
    contexts: ["all"],
  });
}

chrome.contextMenus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case "start-timer":
      if (timerIsRunning) {
        pauseTimer();
        chrome.contextMenus.update("start-timer", {
          title: "Start Timer",
        });
        createNotification("Your timer has stopped.");
      } else {
        startTimer();
        chrome.contextMenus.update("start-timer", {
          title: "Stop Timer",
        });
        createNotification("Your timer has started.");
      }
      break;

    case "reset-timer":
      resetTimer();
      createNotification("Timer is Reset now");
      break;
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    createContextMenus();
  }
});
