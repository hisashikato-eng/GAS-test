/**
 * Installable trigger bootstrap for scheduling the daily reports and warnings.
 */
function setupTriggers() {
  deleteExistingTriggers();

  ScriptApp.newTrigger('handleMorningReport')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();

  ScriptApp.newTrigger('handleEveningReport')
    .timeBased()
    .atHour(18)
    .everyDays(1)
    .create();
}

function deleteExistingTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
}

function handleMorningReport() {
  TaskBriefingBot.sendDailyReports();
}

function handleEveningReport() {
  TaskBriefingBot.sendDailyReports();
}
