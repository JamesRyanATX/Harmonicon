// Simple proxy to window.console that can be hooked into in UI
export class Console {

  error() {
    console.error.apply(console, arguments);
  }

  debug() {
  }

  info() {
  }

  log() {
  }

}