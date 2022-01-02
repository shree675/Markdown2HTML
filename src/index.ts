#!/usr/bin/env node

const { program } = require("commander");
const path = require("path");
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { create } from "./commands/create";
import { deploy } from "./commands/deploy";

// remove all warnings in the terminal
process.removeAllListeners("warning");

program.command("create").description("Creates a series of static web pages from input markdown files").action(create);
program.command("deploy").description("Deploy the generated static web pages from input markdown files").action(deploy);
program.parse();
