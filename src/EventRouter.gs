/**
 * Entry point for Slack event handling.
 * The doPost function is triggered by the Slack App HTTP endpoint.
 */
function doPost(request) {
  if (!request || !request.postData) {
    return ContentService.createTextOutput('No payload');
  }

  var event = JSON.parse(request.postData.contents);
  if (event.type === 'url_verification') {
    return ContentService.createTextOutput(event.challenge);
  }

  if (event.event && event.event.type === 'app_mention') {
    TaskDetectBot.handleMention(event.event);
  } else if (event.type === 'block_actions') {
    TaskDetectBot.handleAction(event);
  }

  return ContentService.createTextOutput('OK');
}
