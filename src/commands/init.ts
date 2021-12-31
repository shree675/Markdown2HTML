const fs = require("fs");
const fsprm = require("fs").promises;
import chalk from "chalk";
import { exit } from "process";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var title = "";
const header = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n`;
};
const footer = `</body>\n</html>\n`;

var input = "";
var path = "";
var dir = "";

function query(query: string) {
  return new Promise((resolve) =>
    readline.question(query, (p: any) => {
      input = p;
      resolve(p);
    })
  );
}

const init = async () => {
  let mdraw = "";
  let lines = [];
  // await query("Enter name of the new folder: ");
  // dir = input;
  // await fsprm.mkdir(dir).catch((err: any) => {
  //   console.log(chalk.red("ERR: ") + err.message);
  //   readline.close();
  //   exit();
  // });
  // await query("Enter the title of the page: ");
  // title = input;
  // await query("Path of the md file " + chalk.grey("[relative path]: "));
  // path = input;
  readline.close();
  const format = path[0] === "/" || path[0] === "." ? "" : "/";
  mdraw = await fsprm.readFile(process.cwd() + "/" + format + path, (err: any, data: any) => {
    if (err) {
      console.log(chalk.red("ERR: ") + err.message);
      exit();
    }
    return data;
  });
  mdraw = mdraw.toString();
  lines = mdraw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace("\r", "");
  }

  dir = "st";
  path = "./t.md";
  title = "test page";

  await fsprm.writeFile(`${dir}/index.html`, header(title) + footer).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    exit();
  });
  await fsprm.writeFile(`${dir}/styles.css`, header(title) + footer).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    exit();
  });
};

export { init };
