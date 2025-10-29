/**
 * Minimal Notion API client for syncing task data.
 */
var NotionClient = (function () {
  function createTaskPage(task) {
    var options = {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + CONFIG.notion.apiToken,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      payload: JSON.stringify({
        parent: { database_id: CONFIG.notion.databaseId },
        properties: buildTaskProperties(task)
      }),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
    if (response.getResponseCode() !== 200) {
      console.error('Notion API error', response.getContentText());
    }
    return response;
  }

  function buildTaskProperties(task) {
    return {
      Name: {
        title: [
          {
            text: {
              content: task.title
            }
          }
        ]
      },
      Assignee: {
        people: task.assigneeIds || []
      },
      Deadline: {
        date: task.deadline ? { start: task.deadline } : null
      },
      Estimate: {
        number: task.estimateHours || null
      },
      Priority: {
        select: task.priority ? { name: task.priority } : null
      },
      Importance: {
        select: task.importance ? { name: task.importance } : null
      },
      Status: {
        select: task.status ? { name: task.status } : { name: 'Not Started' }
      }
    };
  }

  return {
    createTaskPage: createTaskPage
  };
})();
