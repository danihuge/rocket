import chai from 'chai';
import chalk from 'chalk';
import { executeStart, readStartOutput, setFixtureDir } from '@rocket/cli/test-helpers';

const { expect } = chai;

describe('RocketCli preset', () => {
  let cli;

  before(() => {
    // ignore colors in tests as most CIs won't support it
    chalk.level = 0;
    setFixtureDir(import.meta.url);
  });

  afterEach(async () => {
    if (cli?.cleanup) {
      await cli.cleanup();
    }
  });

  it('offers a default layout (with head, header, content, footer, bottom) and raw layout', async () => {
    cli = await executeStart('preset-fixtures/default/rocket.config.js');

    const rawHtml = await readStartOutput(cli, 'raw/index.html');
    expect(rawHtml).to.equal('<p>Just raw</p>');

    const indexHtml = await readStartOutput(cli, 'index.html', {
      stripScripts: true,
      formatHtml: true,
    });
    expect(indexHtml).to.equal(
      [
        '<!DOCTYPE html>',
        '',
        '<html lang="en" dir="ltr">',
        '  <head>',
        '    <meta charset="utf-8" />',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '    <title>Main: Rocket</title>',
        '    <meta property="og:title" content="Main: Rocket" />',
        '',
        '    <meta name="generator" content="rocket 0.1" />',
        '    <link rel="canonical" href="/" />',
        '',
        '    <meta',
        '      name="description"',
        '      content="Rocket is the way to build fast static websites with a sprinkle of JavaScript"',
        '    />',
        '    <meta',
        '      property="og:description"',
        '      content="Rocket is the way to build fast static websites with a sprinkle of JavaScript"',
        '    />',
        '',
        '    <meta property="og:site_name" content="Rocket" />',
        '    <meta property="og:type" content="website" />',
        '',
        '    <meta property="og:image" content="do-not-generate-a-social-media-image" />',
        '    <meta property="og:url" content="/" />',
        '',
        '    <meta name="twitter:card" content="summary_large_image" />',
        '  </head>',
        '',
        '  <body layout="layout-default">',
        '    <header id="main-header">',
        '      <div class="content-area">',
        '        <a class="logo-link" href="/">',
        '          <img src="/_merged_assets/logo.svg" alt="" />',
        '          <span class="sr-only">Rocket</span>',
        '        </a>',
        '      </div>',
        '    </header>',
        '',
        '    <div id="content-wrapper">',
        '      <div class="content-area">',
        '        <main class="markdown-body">',
        '          <h1 id="main">',
        '            <a aria-hidden="true" tabindex="-1" href="#main"><span class="icon icon-link"></span></a',
        '            >Main',
        '          </h1>',
        '        </main>',
        '      </div>',
        '    </div>',
        '',
        '    <footer id="main-footer"></footer>',
        '  </body>',
        '</html>',
      ].join('\n'),
    );
  });

  it('allows to add content to the head without overriding', async () => {
    cli = await executeStart('preset-fixtures/add-to-head/rocket.config.js');

    const indexHtml = await readStartOutput(cli, 'index.html');
    expect(indexHtml).to.include('<meta name="added" content="at the top" />');
  });
});
