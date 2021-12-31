#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander").program;
var init_1 = require("./commands/init");
program.command("init").description("Creates a series of static web pages from input markdown files").action(init_1.init);
program.parse();
