import { parseArgs } from "node:util";
import { fetchPage } from "./fetch.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    format: { type: "string", default: "text" },
    timeout: { type: "string", default: "10" },
  },
});

const page = await fetchPage(positionals[0], { timeout: Number(values.timeout) });
console.log(values.format === "json" ? JSON.stringify(page) : page.body);
