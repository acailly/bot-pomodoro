const ProgressBar = require("progress");
const chalk = require("chalk");
const notifier = require("node-notifier");

let timer;

const tick = (bar, timeBetweenTwoTicksInMs) => {
  timer = setTimeout(function() {
    bar.tick();
    if (bar.complete) {
      console.log("\nPomodoro complete\n");
      notifier.notify({
        title: "Pomodoro complete",
        message: "Take a break"
      });
      stopCurrentPomodoro();
    } else {
      tick(bar, timeBetweenTwoTicksInMs);
    }
  }, timeBetweenTwoTicksInMs);
};

const stopCurrentPomodoro = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

module.exports = function(vorpal) {
  vorpal
    .command("pomodoro [minuteCount]")
    .option("--stop", "Stop current pomodoro")
    .description("Start a pomodoro")
    .action(function(args, callback) {
      if (args.options.stop) {
        stopCurrentPomodoro();
        callback();
      } else {
        stopCurrentPomodoro();

        const minuteCount = args.minuteCount || 20;
        const tickCount = minuteCount * 2;
        const timeBetweenTwoTicksInMs = 1000 * (minuteCount * 60 / tickCount);

        const bar = new ProgressBar(":bar", {
          total: tickCount,
          complete: "█",
          incomplete: "-"
        });
        tick(bar, timeBetweenTwoTicksInMs);
        console.log("Pomodoro started!");
        notifier.notify({
          title: "Pomodoro started",
          message: minuteCount + " minutes"
        });
        callback();
      }
    });
};
