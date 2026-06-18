import { dist, make } from "./src/main";
import minimist from "minimist";

const args = minimist(process.argv.slice(2), {
  boolean: ['make'],
  string: ['output', 'input'],
  alias: {
    'input': ['input-dir', 'inputDir', 'i'],
    'output': ['output-dir', 'outputDir', 'o'],
  },
});

if (args.make) {
  make(args);
} else {
  dist(args);
}
