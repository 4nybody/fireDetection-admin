// src/pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const activeTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
                  document.documentElement.className = activeTheme;
                  document.documentElement.style.colorScheme = activeTheme;
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
