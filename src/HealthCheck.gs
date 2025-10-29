/**
 * Executes a minimal health check so CI can verify the Apps Script project.
 */
function healthCheck() {
  try {
    var config = typeof CONFIG !== 'undefined' ? CONFIG : {};
    var result = {
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      slackConfigured: !!(config.slack && config.slack.botToken),
      notionConfigured: !!(config.notion && config.notion.apiToken),
      bots: {
        detect: typeof TaskDetectBot !== 'undefined' && !!TaskDetectBot,
        check: typeof TaskCheckBot !== 'undefined' && !!TaskCheckBot,
        briefing: typeof TaskBriefingBot !== 'undefined' && !!TaskBriefingBot
      }
    };

    if (!result.bots.detect || !result.bots.check || !result.bots.briefing) {
      throw new Error('One or more task bots are not loaded properly');
    }

    return result;
  } catch (error) {
    throw new Error('Health check failed: ' + error.message);
  }
}
