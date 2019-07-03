import React from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import getDocsLayout from './services/getDocsLayout';
import * as config from './services/config';
import getParameters from './services/getParameters';
import ReadmeContent from './components/ReadmeContent';

import { CHANNEL_SET_SIDEBAR_DOCS } from './const';

export { default as withDocs } from './with-docs';
export { default as withReadme } from './with-readme';
export { doc } from './backwardCompatibility';

export const configureReadme = parameters => {
  config.addHeader(parameters.header);
  config.addFooter(parameters.footer);

  config.addStoryPreview(parameters.StoryPreview);
  config.addDocPreview(parameters.DocPreview);
  config.addHeaderPreview(parameters.HeaderPreview);
  config.addFooterPreview(parameters.FooterPreview);
};

export const addHeader = md => {
  config.addHeader(md);
};

export const addFooter = md => {
  config.addFooter(md);
};

export const addReadme = makeDecorator({
  name: 'addReadme',
  parameterName: 'readme',
  wrapper: (getStory, context) => {
    const parameters = getParameters(context);

    const story = <React.Fragment>{getStory(context)}</React.Fragment>;
    const layout = parameters.layout
      ? parameters.layout
      : getDocsLayout({
          footer: parameters.footer || '',
          header: parameters.header || '',
          md: parameters.content || '',
          excludePropTables: parameters.excludePropTables || [],
          includePropTables: parameters.includePropTables || [],
          story,
        });

    const channel = addons.getChannel();

    if (parameters.sidebar) {
      const sidebarLayout = getDocsLayout({
        footer: parameters.footer || '',
        header: parameters.header || '',
        md: parameters.sidebar,
        excludePropTables: parameters.excludePropTables || [],
        includePropTables: parameters.includePropTables || [],
        story,
      });

      channel.emit(CHANNEL_SET_SIDEBAR_DOCS, {
        layout: sidebarLayout,
        theme: parameters.theme,
        codeTheme: parameters.highlightSidebar ? parameters.codeTheme : null,
      });
    }

    return (
      <ReadmeContent
        layout={layout}
        theme={parameters.theme}
        codeTheme={parameters.highlightContent ? parameters.codeTheme : null}
        StoryPreview={parameters.StoryPreview}
        HeaderPreview={parameters.HeaderPreview}
        DocPreview={parameters.DocPreview}
        FooterPreview={parameters.FooterPreview}
      />
    );
  },
});
