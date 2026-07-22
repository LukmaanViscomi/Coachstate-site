const fs = require('fs');
const path = require('path');

global.window = {
  location: { href: 'http://localhost:3000' },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {}
};
global.document = {
  createElement: () => ({ style: {} }),
  querySelector: () => null,
  body: { style: {} }
};
global.navigator = { userAgent: 'node' };
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

try {
  const { buildSync } = require('esbuild');
  buildSync({
    entryPoints: ['src/App.jsx'],
    bundle: true,
    outfile: 'dist/app_test.cjs',
    format: 'cjs',
    jsx: 'automatic',
    loader: { '.jsx': 'jsx', '.js': 'js', '.css': 'empty', '.png': 'text', '.jpg': 'text' }
  });

  const React = require('react');
  const ReactDOMServer = require('react-dom/server');
  const AppModule = require('./dist/app_test.cjs');
  const App = AppModule.default || AppModule;

  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log('React Render SUCCESS! HTML length:', html.length, 'bytes');
} catch (err) {
  console.error('React Render FAIL Exception:', err);
}
