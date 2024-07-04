import app from 'flarum/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

app.initializers.add('litalino-related-discussions', () => {
  app.extensionData.for('litalino-related-discussions').registerSetting({
    setting: 'litalino-related-discussions.relatedLimit',
    name: 'relatedLimit',
    type: 'number',
    label: app.translator.trans('litalino-related-discussions.admin.relatedLimit'),
    help: app.translator.trans('litalino-related-discussions.admin.relatedLimit-help'),
  });
  app.extensionData.for('litalino-related-discussions').registerSetting({
    setting: 'litalino-related-discussions.showTooltip',
    label: app.translator.trans('litalino-related-discussions.admin.showTooltip'),
    type: 'boolean',
  });
  app.extensionData.for('litalino-related-discussions').registerSetting({
    setting: 'litalino-related-discussions.relatedTitle',
    name: 'relatedTitle',
    type: 'text',
    label: app.translator.trans('litalino-related-discussions.admin.relatedTitle'),
    help: app.translator.trans('litalino-related-discussions.admin.relatedTitle-help'),
    placeholder: 'You title...',
  });

  app.extensionData.for('litalino-related-discussions').registerSetting({
    setting: 'litalino-related-discussions.DiscussionPageLayout',
    label: app.translator.trans('litalino-related-discussions.admin.DiscussionPageLayout'),
    type: 'boolean',
  });
});
