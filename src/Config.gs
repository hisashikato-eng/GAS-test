/**
 * Centralized configuration for Slack, Notion, and runtime toggles.
 * These values should eventually be injected via the Apps Script properties service.
 */
var CONFIG = {
  slack: {
    botToken: PropertiesService.getScriptProperties().getProperty('SLACK_BOT_TOKEN'),
    signingSecret: PropertiesService.getScriptProperties().getProperty('SLACK_SIGNING_SECRET'),
    defaultChannel: '#general'
  },
  notion: {
    apiToken: PropertiesService.getScriptProperties().getProperty('NOTION_API_TOKEN'),
    databaseId: PropertiesService.getScriptProperties().getProperty('NOTION_DATABASE_ID')
  },
  reporting: {
    morningReportCron: '0 9 * * *',
    eveningReportCron: '0 18 * * *'
  }
};
