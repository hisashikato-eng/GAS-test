/**
 * Minimal Slack Web API client for posting messages and interacting with buttons.
 */
var SlackClient = (function () {
  function postMessage(channel, text, blocks) {
    var payload = {
      channel: channel,
      text: text,
      blocks: blocks || []
    };

    var options = {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + CONFIG.slack.botToken,
        'Content-Type': 'application/json; charset=utf-8'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);
    if (response.getResponseCode() !== 200) {
      console.error('Slack API error', response.getContentText());
    }
    return response;
  }

  function openModal(triggerId, view) {
    var options = {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + CONFIG.slack.botToken,
        'Content-Type': 'application/json; charset=utf-8'
      },
      payload: JSON.stringify({ trigger_id: triggerId, view: view }),
      muteHttpExceptions: true
    };

    return UrlFetchApp.fetch('https://slack.com/api/views.open', options);
  }

  return {
    postMessage: postMessage,
    openModal: openModal
  };
})();
