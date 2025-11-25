/**
 * Validates required task fields and persists the task via Notion.
 */
var TaskCheckBot = (function () {
  var REQUIRED_FIELDS = ['title', 'deadline', 'estimateHours', 'priority', 'importance', 'assigneeIds'];
  var FIELD_LABELS = {
    title: 'タスク名',
    deadline: '期限',
    estimateHours: '見積時間',
    priority: '緊急度',
    importance: '重要度',
    assigneeIds: '担当者'
  };

  function validateAndPersist(serializedTask, fallbackChannel) {
    var task = serializedTask ? JSON.parse(serializedTask) : {};
    task.channel = task.channel || fallbackChannel || CONFIG.slack.defaultChannel;
    task.assigneeIds = task.assigneeIds || [];
    task.deadline = task.deadline || '';
    task.estimateHours = task.estimateHours || '';
    task.priority = task.priority || '';
    task.importance = task.importance || '';
    var validation = validate(task);

    if (!validation.valid) {
      SlackClient.postMessage(task.channel, validation.message);
      return;
    }

    NotionClient.createTaskPage(task);
    SlackClient.postMessage(task.channel, 'タスクを登録しました。');
  }

  function validate(task) {
    var missing = [];
    REQUIRED_FIELDS.forEach(function (field) {
      if (!task[field] || (Array.isArray(task[field]) && task[field].length === 0)) {
        missing.push(field);
      }
    });

    if (missing.length) {
      var labels = missing.map(function (field) {
        return FIELD_LABELS[field] || field;
      });
      return {
        valid: false,
        message: '以下の必須項目が不足しています: ' + labels.join(', ')
      };
    }

    var deadlineValidation = validateDeadline(task.deadline);
    if (!deadlineValidation.valid) {
      return deadlineValidation;
    }

    return { valid: true };
  }

  function validateDeadline(deadline) {
    var parsed = new Date(deadline);
    if (isNaN(parsed.getTime())) {
      return {
        valid: false,
        message: '期限は YYYY-MM-DD 形式で入力してください。'
      };
    }

    var todayTokyo = new Date(Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd'));
    var targetDate = new Date(Utilities.formatDate(parsed, 'Asia/Tokyo', 'yyyy-MM-dd'));

    if (targetDate < todayTokyo) {
      return {
        valid: false,
        message: '期限は今日以降の日付を指定してください。'
      };
    }

    return { valid: true };
  }

  return {
    validateAndPersist: validateAndPersist
  };
})();
