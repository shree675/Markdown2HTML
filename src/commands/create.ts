const fsprm = require("fs").promises;
const fetch = require("node-fetch");
const path = require("path");
const figlet = require("figlet");
import PasteClient from "pastebin-api";
import chalk from "chalk";
import { exit } from "process";
import { headerPage, indexHeader, footerNext, footer } from "../exports";
import {
  bolditalicreg,
  italicreg,
  boldreg,
  nothrreg,
  hrreg,
  codereg,
  altcodereg,
  multicodereg,
  olreg,
  ulreg,
  linkreg,
  imagereg,
  strikethroughreg,
} from "../regex";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new PasteClient(process.env.PASTEBIN_DEV_KEY ?? "");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var input = "";
var pathname = "";
var format = "";
var titles: string[] = [];
var booktitle = "";

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
  var dir = "";

  await query("Enter name of the new folder: ");
  dir = input;
  await fsprm.mkdir(dir).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    readline.close();
    exit();
  });
  console.log(chalk.greenBright("New folder created successfully"));
  await fsprm.mkdir(`${dir}/pages`).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    readline.close();
    exit();
  });
  await fsprm.writeFile(`${dir}/styles.css`, await createStyles()).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    exit();
  });
  await query("Enter the title of the book: ");
  booktitle = input;
  await initiateCreate(1, dir);
  await createIndex(dir);
  console.log(
    "Thanks for using",
    chalk.cyan(
      figlet.textSync(" ssg", {
        font: "Slant",
      })
    )
  );
  readline.close();
  exit();
};

const initiateCreate = async (i: number, dir: string) => {
  let mdraw = "";
  let title = "";
  let anotherPageResponse = "n";

  await query("Enter the title of the page: ");
  title = input;
  titles.push(title);
  await query("Enter path of the md file " + chalk.grey("[relative path]: "));
  pathname = input;
  format = pathname[0] === "/" || pathname[0] === "." ? "" : "/";
  mdraw = await fsprm.readFile(process.cwd() + "/" + format + pathname, (err: any, data: any) => {
    if (err) {
      console.log(chalk.red("ERR: ") + err.message);
      exit();
    }
    return data;
  });
  mdraw = mdraw.toString();
  var finalbody = await parseMd(mdraw, dir);
  console.log(chalk.green("Successfully generated!"));
  await query("Do you want to add another page? " + chalk.grey("[y/N] "));
  anotherPageResponse = input;
  if (anotherPageResponse.toLowerCase().trim()[0] === "y") {
    await fsprm
      .writeFile(`${dir}/pages/page${i}.html`, headerPage(title) + finalbody + footerNext(`page${i + 1}.html`))
      .catch((err: any) => {
        console.log(chalk.red("ERR: ") + err.message);
        readline.close();
        exit();
      });
    await initiateCreate(i + 1, dir);
  } else {
    await fsprm.writeFile(`${dir}/pages/page${i}.html`, headerPage(title) + finalbody + footer).catch((err: any) => {
      console.log(chalk.red("ERR: ") + err.message);
      exit();
    });
  }
};

const createIndex = async (dir: string) => {
  var body = "";
  var i = 1;

  titles.forEach((page: string) => {
    body += `<div><a href="pages/page${i}.html" id="index-a">${page}</a><span id="num">${i}</span></div>\n`;
    i++;
  });
  await fsprm.writeFile(`${dir}/index.html`, indexHeader(booktitle) + body + footer).catch((err: any) => {
    console.log(chalk.red("ERR: ") + err.message);
    readline.close();
    exit();
  });
};

const parseMd = async (mdraw: string, dir: string): Promise<string> => {
  var lines: string[];
  var words;
  var body = "";
  var offset;
  var flag;
  var index = 0;
  var temp = "";

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
  for (let line of lines) {
    flag = false;
    offset = 0;
    if (line === "" && lines[index + 1] === "") {
      line = "<br></br>";
      body += line + "\n";
      index++;
      continue;
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
    if (line.substring(0, 1) === ">") {
      flag = true;
      line = `<div id="block">${line.slice(1).trim()}</div>`;
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
    // images
    words = line.match(imagereg);
    for (let word of words ?? "") {
      var alttext = "";
      var href = "";
      var array = word.split("](");
      alttext = array[0].slice(2);
      href = path.resolve(process.cwd() + "/" + format + pathname);
      href = path.join(href, "../");
      href = path.join(href, array[1].slice(0, array[1].length - 1));
      const imagefile = await fsprm.readFile(href, (err: any, data: any) => {
        if (err) {
          console.log(chalk.red("ERR: ") + err.message);
          exit();
        }
        return data;
      });
      for (let i = path.resolve(href, "../").length + 1; i < href.length; i++) {
        temp += href[i];
      }
      href = `assets/${temp}`;
      await fsprm.mkdir(`${dir}/assets`).catch((err: any) => {});
      await fsprm.writeFile(`${dir}/${href}`, imagefile).catch((err: any) => {
        console.log(chalk.red("ERR: ") + err.message);
        exit();
      });
      line = line.replace(word, `<img src="../${href}" alt="${alttext}"></img>`);
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
    // replace \< and \>
    line = line.replace(/\\</g, "&lt;");
    line = line.replace(/\\>/g, "&gt;");
    body += line + "\n";
    index++;
  }
  return body;
};

export { create };
