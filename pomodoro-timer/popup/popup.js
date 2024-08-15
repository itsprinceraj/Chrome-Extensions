const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const text = document.getElementById("timer");

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  text.textContent = `${String(minutes).padStart(2, "0")}:${String(
    sec
  ).padStart(2, "0")}`;
}

// Listen for updates from storage to update the UI
chrome.storage.onChanged.addListener((changes) => {
  if (changes.seconds) {
    updateTimerDisplay(changes.seconds.newValue);
  }
  if (changes.timerIsRunning) {
    const running = changes.timerIsRunning.newValue;
    if (running) {
      startBtn.style.display = "none";
      pauseBtn.style.display = "inline";
    } else {
      startBtn.style.display = "inline";
      // startBtn.textContent = "Resume";
      pauseBtn.style.display = "none";
    }
  }
});

// Send messages to the service worker
startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" });
});
pauseBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "pause" });
});
resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset" });
});

// Initialize the popup UI with current timer state
chrome.storage.local.get(["seconds", "timerIsRunning"], (result) => {
  updateTimerDisplay(result.seconds || 25 * 60);
  if (result.timerIsRunning) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline";
  } else {
    startBtn.style.display = "inline";
    pauseBtn.style.display = "none";
  }
});
