const fsprm = require("fs").promises;
const fetch = require("node-fetch");
import PasteClient from "pastebin-api";
import chalk from "chalk";
import { exit } from "process";
import { header, footer } from "../exports";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new PasteClient(process.env.PASTEBIN_DEV_KEY ?? "");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var title = "";
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
const multicodereg = /(^|\n)```\n[^`]*\n```($|\n)/g;
const olreg = /^[1-9][0-9]*\. .*/; // first occurrence
const ulreg = /^\* .*/; // first occurrence
const linkreg = /\[[^\[^\]^]*\]\([^ ^\[^\]]*\)/g;
const imagereg = /\!\[[^\[^\]^]*\]\([^\[^\]]*\)/g;
const strikethroughreg = /~~[^~]*~~/g;

function query(query: string) {
  return new Promise((resolve) =>
    readline.question(query, (p: any) => {
      input = p;
      resolve(p);
    })
  );
}

function encode(data: { [key: string]: unknown }): BodyInit {
  let string = "";
  for (const [key, value] of Object.entries(data)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`;
  }
  return string.substring(1);
}

async function getRawPasteByKey(options: any): Promise<string> {
  const res = await fetch("https://pastebin.com/api/api_raw.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({
      api_option: "show_paste",
      api_dev_key: options.apiKey,
      api_user_key: options.userKey,
      api_paste_key: options.pasteKey,
    }),
  });
  const data = await res.text();
  if (data.toLowerCase().startsWith("bad api request")) {
    return Promise.reject(data);
  }
  return data;
}

const createStyles = async () => {
  const token = await client.login(process.env.PASTEBIN_USERNAME ?? "", process.env.PASTEBIN_PASSWORD ?? "");
  var pastes = await client.getPastesByUser({
    userKey: token,
    limit: 100,
  });
  pastes = pastes?.sort(function (a, b) {
    var keyA = a.paste_date,
      keyB = b.paste_date;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  const styles = await getRawPasteByKey({
    pasteKey: (pastes || [])[0].paste_key,
    userKey: token,
    apiKey: process.env.PASTEBIN_DEV_KEY,
  });
  return styles;
};

const create = async () => {
  let mdraw = "";
  await query("Enter name of the new folder: ");
  dir = input;
  await fsprm.mkdir(dir).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    readline.close();
    exit();
  });
  await query("Enter the title of the page: ");
  title = input;
  await query("Enter path of the md file " + chalk.grey("[relative path]: "));
  path = input;
  readline.close();

  // dir = "st";
  // path = "./t.md";
  // title = "test page";

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
  await fsprm.writeFile(`${dir}/styles.css`, await createStyles()).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    exit();
  });
  exit();
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
        mdraw = mdraw.replace(
          word,
          `\n<div id="multi-code">${word.slice(word[0] === "\n" ? 5 : 4, word.length - 4)}</div>\n`
        );
      })
    : null;
  mdraw = mdraw.replace(/\t/g, "&emsp; ");
  lines = mdraw.split("\n");
  var body = "";
  var offset;
  var flag;
  lines.forEach((line: string, index: number) => {
    flag = false;
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
          flag = true;
          line = line.replace(word, `<span id="code">${word.slice(3, word.length - 3)}</span>`);
        })
      : null;
    words = line.match(codereg);
    words
      ? words.forEach((word: string, index: number) => {
          flag = true;
          line = line.replace(word, `<span id="code">${word.slice(1, word.length - 1)}</span>`);
        })
      : null;
    // ~~strike through~~
    words = line.match(strikethroughreg);
    words
      ? words.forEach((word: string, index: number) => {
          flag = true;
          line = line.replace(word, `<strike>${word.slice(2, word.length - 2)}</strike>`);
        })
      : null;
    // ordered list
    words = line.match(olreg);
    words
      ? words.forEach((word: string, index: number) => {
          flag = true;
          line = line.replace(word, `<div id="list">${word.slice(0, word.length)}</div>`);
        })
      : null;
    // unordered list
    words = line.match(ulreg);
    words
      ? words.forEach((word: string, index: number) => {
          flag = true;
          line = line.replace(word, `<div id="list">${word.slice(0, word.length)}</div>`);
          line = line.replace(/\*/, "●");
        })
      : null;
    // block
    if (line.substring(0, 2) === "> ") {
      flag = true;
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
      line = !flag ? `<p>${line}</p>` : line;
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
          line = line.replace(word, `<a href="${href}" target="_blank">${innerhtml}</a>`);
        })
      : null;
    body += line + "\n";
  });
  return body;
};

export { create };
