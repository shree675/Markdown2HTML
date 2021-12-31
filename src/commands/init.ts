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

const bolditalicreg = /\*\*\*[^\*]+\*\*\*/g;
const italicreg = /\*[^\*]+\*/g;
const boldreg = /\*\*[^\*]+\*\*/g;
const nothrreg = /[^- ]+/g;
const hrreg = /\-/g;
const codereg = /`[^`]+`/g;
const altcodereg = /```[^`]+```/g;
const multicodereg = /```\n[^`]*\n```($|\n)/g;
const olreg = /^[1-9][0-9]*\. /; // first occurrence
const ulreg = /^\*\. /; // first occurrence
const linkreg = /\[[^\[^\]^ ]*\]\([^ ^\[^\]]*\)/g;

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

  dir = "st";
  path = "./t.md";
  title = "test page";

  const format = path[0] === "/" || path[0] === "." ? "" : "/";
  mdraw = await fsprm.readFile(process.cwd() + "/" + format + path, (err: any, data: any) => {
    if (err) {
      console.log(chalk.red("ERR: ") + err.message);
      exit();
    }
    return data;
  });
  mdraw = mdraw.toString();
  var finalbody = parseMd(mdraw);
  await fsprm.writeFile(`${dir}/index.html`, header(title) + finalbody + footer).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    exit();
  });
  // await fsprm.writeFile(`${dir}/styles.css`, header(title) + footer).catch((err: any) => {
  //   console.log(chalk.red("ERR: ") + err.message);
  //   exit();
  // });
};

const parseMd = (mdraw: string) => {
  var lines: string[];
  var words;
  mdraw += "\n";
  // multi-line code
  mdraw = mdraw.replace(/\r\n/g, "\n");
  words = mdraw.match(multicodereg);
  words
    ? words.forEach((word: string, index: number) => {
        mdraw = mdraw.replace(word, `\n<div id="multi-code">${word.slice(4, word.length - 4)}</div>\n`);
      })
    : null;
  mdraw = mdraw.replace(/\t/g, "&emsp; ");
  lines = mdraw.split("\n");
  var body = "";
  var offset;
  lines.forEach((line: string, index: number) => {
    offset = 0;
    if (line === "" && lines[index + 1] === "") {
      line = "<br></br>";
      body += line + "\n";
      return;
    }
    line = line.trim();
    // ***bold italic***
    words = line.match(bolditalicreg);
    words
      ? words.forEach((word: string, index: number) => {
          line = line.replace(word, `<b><i>${word.slice(3, word.length - 3)}</i></b>`);
        })
      : null;
    // **bold**
    words = line.match(boldreg);
    words
      ? words.forEach((word: string, index: number) => {
          line = line.replace(word, `<b>${word.slice(2, word.length - 2)}</b>`);
        })
      : null;
    // *italic*
    words = line.match(italicreg);
    words
      ? words.forEach((word: string, index: number) => {
          line = line.replace(word, `<i>${word.slice(1, word.length - 1)}</i>`);
        })
      : null;
    // single line code
    words = line.match(altcodereg);
    words
      ? words.forEach((word: string, index: number) => {
          line = line.replace(word, `<span id="code">${word.slice(3, word.length - 3)}</span>`);
        })
      : null;
    words = line.match(codereg);
    words
      ? words.forEach((word: string, index: number) => {
          line = line.replace(word, `<span id="code">${word.slice(1, word.length - 1)}</span>`);
        })
      : null;
    // block
    if (line.substring(0, 2) === "> ") {
      line = `<div id="block">${line.slice(2)}</div>`;
      offset = 16;
    }
    // headers, etc.
    if (line.substring(0 + offset, 4 + offset) === "### ") {
      line = `<div id="hd3">${line.replace(/### /, "")}</div>`;
    } else if (line.substring(0 + offset, 3 + offset) === "## ") {
      line = `<div id="hd2">${line.replace(/## /, "")}</div>`;
    } else if (line.substring(0 + offset, 2 + offset) === "# ") {
      line = `<div id="hd1">${line.replace(/# /, "")}</div>`;
    } else if (!line.match(nothrreg) && (line.match(hrreg) || []).length >= 3) {
      line = '<hr id="line">';
    } else {
      line = `<p>${line}</p>`;
    }
    // links
    words = line.match(linkreg);
    words
      ? words.forEach((word: string, index: number) => {
          var innerhtml = "";
          var href = "";
          var array = word.split("](");
          innerhtml = array[0].slice(1);
          href = array[1].slice(0, array[1].length - 1);
          line = line.replace(word, `<a href="${href}">${innerhtml}</a>`);
        })
      : null;
    body += line + "\n";
  });
  return body;
};

export { init };
