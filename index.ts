// index.ts
import { registerRootComponent } from 'expo';
import { checkEnv } from './src/core/config/checkEnv';

// Crash with one readable message if .env is incomplete, before anything reads a
// variable and fails in a more confusing way. ES imports are hoisted, so App has to
// be require()d *after* the check rather than imported at the top.
checkEnv();

const App = require('./App').default;

registerRootComponent(App);
