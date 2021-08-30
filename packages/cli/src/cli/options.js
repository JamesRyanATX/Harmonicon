// Common options that can be imported and used by commands
export const options = {

  help: {
    name: "help",
    alias: "h",
    type: Boolean,
    defaultValue: false,
    description: "Print this usage guide.",
  }

}

// Options available for every command
export const globalOptions = [
  options.help,
];

