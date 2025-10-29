/**
 * Generates daily reports and capacity metrics.
 */
var TaskBriefingBot = (function () {
  function sendDailyReports() {
    var report = buildReport();
    SlackClient.postMessage(CONFIG.slack.defaultChannel, report.text, report.blocks);
  }

  function buildReport() {
    var tasks = fetchTasksFromNotion();
    var grouped = groupByStatus(tasks);
    var summaryText = '*日次タスクレポート*\n';
    summaryText += grouped.overdue.length ? ':warning: 期限超過タスクがあります\n' : '';

    var blocks = [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: summaryText }
      },
      buildStatusBlock('未着手', grouped.notStarted),
      buildStatusBlock('進行中', grouped.inProgress),
      buildStatusBlock('完了', grouped.completed)
    ];

    return { text: '日次タスクレポートを投稿しました。', blocks: blocks };
  }

  function fetchTasksFromNotion() {
    // TODO: Implement Notion DB query once schema is finalized.
    return [];
  }

  function groupByStatus(tasks) {
    var now = new Date();
    var result = {
      notStarted: [],
      inProgress: [],
      completed: [],
      overdue: []
    };

    tasks.forEach(function (task) {
      if (task.status === 'Completed') {
        result.completed.push(task);
      } else if (task.status === 'In Progress') {
        result.inProgress.push(task);
      } else {
        result.notStarted.push(task);
      }

      if (task.deadline && new Date(task.deadline) < now && task.status !== 'Completed') {
        result.overdue.push(task);
      }
    });

    return result;
  }

  function buildStatusBlock(title, tasks) {
    var lines = tasks.map(function (task) {
      return '- ' + task.title + ' (担当: ' + (task.assignees || []).join(', ') + ')';
    });
    var text = lines.length ? lines.join('\n') : '該当なし';
    return {
      type: 'section',
      text: { type: 'mrkdwn', text: '*' + title + '*\n' + text }
    };
  }

  return {
    sendDailyReports: sendDailyReports
  };
})();
