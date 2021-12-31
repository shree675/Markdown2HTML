#!/usr/bin/env node

const { program } = require("commander");

import { init } from "./commands/init";

program.command("init").description("Creates a series of static web pages from input markdown files").action(init);
program.parse();
