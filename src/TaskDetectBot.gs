/**
 * Handles Slack messages and determines whether they represent actionable tasks.
 */
var TaskDetectBot = (function () {
  function handleMention(event) {
    var taskDraft = parseTask(event.text, event);
    if (!taskDraft) {
      SlackClient.postMessage(event.channel, 'タスクっぽい記述が見つかりませんでした。もう少し詳しく教えてください。');
      return;
    }

    var confirmationBlocks = buildConfirmationBlocks(taskDraft);
    SlackClient.postMessage(event.channel, 'こちらのタスクで登録しますか？', confirmationBlocks);
  }

  function handleAction(event) {
    var payload = JSON.parse(event.payload || JSON.stringify(event));
    if (!payload.actions || !payload.actions.length) {
      return;
    }

    var action = payload.actions[0];
    if (!action.value) {
      return;
    }

    if (action.value.indexOf('approve:') === 0) {
      var encoded = action.value.substring('approve:'.length);
      var decoded = Utilities.base64Decode(encoded);
      var serializedTask = Utilities.newBlob(decoded).getDataAsString();
      TaskCheckBot.validateAndPersist(serializedTask, resolveChannelId(payload));
    } else if (action.value === 'skip_task') {
      SlackClient.postMessage(resolveChannelId(payload), 'タスク登録をスキップしました。');
    }
  }

  function resolveChannelId(payload) {
    if (payload.channel && payload.channel.id) {
      return payload.channel.id;
    }
    if (payload.container && payload.container.channel_id) {
      return payload.container.channel_id;
    }
    return CONFIG.slack.defaultChannel;
  }

  function parseTask(text, event) {
    if (!text) {
      return null;
    }

    var title = text.replace(/<@[^>]+>/g, '').trim();
    if (!title) {
      return null;
    }

    var assignees = (event.text.match(/<@([^>]+)>/g) || []).map(function (mention) {
      return mention.replace(/[<@>]/g, '');
    });

    return {
      title: title,
      assignees: assignees,
      channel: event.channel
    };
  }

  function buildConfirmationBlocks(task) {
    var serialized = JSON.stringify({
      title: task.title,
      assigneeIds: task.assignees,
      channel: task.channel,
      status: 'Not Started'
    });
    var encoded = Utilities.base64Encode(Utilities.newBlob(serialized).getBytes());

    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*タスク名*: ' + task.title + '\n*担当候補*: ' + formatAssigneeMentions(task.assignees)
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '登録する' },
            style: 'primary',
            value: 'approve:' + encoded
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'スキップ' },
            style: 'danger',
            value: 'skip_task'
          }
        ]
      }
    ];
  }

  function formatAssigneeMentions(ids) {
    if (!ids || !ids.length) {
      return '未指定';
    }

    return ids.map(function (id) {
      return '<@' + id + '>';
    }).join(', ');
  }

  return {
    handleMention: handleMention,
    handleAction: handleAction
  };
})();
