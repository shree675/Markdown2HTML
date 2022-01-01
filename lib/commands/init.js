"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var fs = require("fs");
var fsprm = require("fs").promises;
var chalk_1 = __importDefault(require("chalk"));
var process_1 = require("process");
var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
var title = "";
var header = function (t) {
    return "<!doctype html>\n<html>\n<head>\n\t<meta charset=\"utf-8\">\n\t<title>".concat(t, "</title>\n\t<meta name=\"description\" content=\"").concat(t, "\">\n\t<link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n");
};
var footer = "</body>\n</html>\n";
var input = "";
var path = "";
var dir = "";
var bolditalicreg = /\*\*\*[^\*]+\*\*\*/g;
var italicreg = /\*[^\*]+\*/g;
var boldreg = /\*\*[^\*]+\*\*/g;
var nothrreg = /[^- ]+/g;
var hrreg = /\-/g;
var codereg = /`[^`]+`/g;
var altcodereg = /```[^`]+```/g;
var multicodereg = /(^|\n)```\n[^`]*\n```($|\n)/g;
var olreg = /^[1-9][0-9]*\. /; // first occurrence
var ulreg = /^\*\. /; // first occurrence
var linkreg = /\[[^\[^\]^ ]*\]\([^ ^\[^\]]*\)/g;
function query(query) {
    return new Promise(function (resolve) {
        return readline.question(query, function (p) {
            input = p;
            resolve(p);
        });
    });
}
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mdraw, lines, format, finalbody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mdraw = "";
                lines = [];
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
                format = path[0] === "/" || path[0] === "." ? "" : "/";
                return [4 /*yield*/, fsprm.readFile(process.cwd() + "/" + format + path, function (err, data) {
                        if (err) {
                            console.log(chalk_1.default.red("ERR: ") + err.message);
                            (0, process_1.exit)();
                        }
                        return data;
                    })];
            case 1:
                mdraw = _a.sent();
                mdraw = mdraw.toString();
                finalbody = parseMd(mdraw);
                return [4 /*yield*/, fsprm.writeFile("".concat(dir, "/index.html"), header(title) + finalbody + footer).catch(function (err) {
                        console.log(chalk_1.default.red("ERR: ") + err.message);
                        (0, process_1.exit)();
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.init = init;
var parseMd = function (mdraw) {
    var lines;
    var words;
    mdraw += "\n";
    // multi-line code
    mdraw = mdraw.replace(/\r\n/g, "\n");
    words = mdraw.match(multicodereg);
    words
        ? words.forEach(function (word, index) {
            mdraw = mdraw.replace(word, "\n<div id=\"multi-code\">".concat(word.slice(word[0] === "\n" ? 5 : 4, word.length - 4), "</div>\n"));
        })
        : null;
    mdraw = mdraw.replace(/\t/g, "&emsp; ");
    lines = mdraw.split("\n");
    var body = "";
    var offset;
    var flag;
    lines.forEach(function (line, index) {
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
            ? words.forEach(function (word, index) {
                line = line.replace(word, "<b><i>".concat(word.slice(3, word.length - 3), "</i></b>"));
            })
            : null;
        // **bold**
        words = line.match(boldreg);
        words
            ? words.forEach(function (word, index) {
                line = line.replace(word, "<b>".concat(word.slice(2, word.length - 2), "</b>"));
            })
            : null;
        // *italic*
        words = line.match(italicreg);
        words
            ? words.forEach(function (word, index) {
                line = line.replace(word, "<i>".concat(word.slice(1, word.length - 1), "</i>"));
            })
            : null;
        // single line code
        words = line.match(altcodereg);
        words
            ? words.forEach(function (word, index) {
                flag = true;
                line = line.replace(word, "<span id=\"code\">".concat(word.slice(3, word.length - 3), "</span>"));
            })
            : null;
        words = line.match(codereg);
        words
            ? words.forEach(function (word, index) {
                flag = true;
                line = line.replace(word, "<span id=\"code\">".concat(word.slice(1, word.length - 1), "</span>"));
            })
            : null;
        // block
        if (line.substring(0, 2) === "> ") {
            flag = true;
            line = "<div id=\"block\">".concat(line.slice(2), "</div>");
            offset = 16;
        }
        // headers, etc.
        if (line.substring(0 + offset, 4 + offset) === "### ") {
            line = "<div id=\"hd3\">".concat(line.replace(/### /, ""), "</div>");
        }
        else if (line.substring(0 + offset, 3 + offset) === "## ") {
            line = "<div id=\"hd2\">".concat(line.replace(/## /, ""), "</div>");
        }
        else if (line.substring(0 + offset, 2 + offset) === "# ") {
            line = "<div id=\"hd1\">".concat(line.replace(/# /, ""), "</div>");
        }
        else if (!line.match(nothrreg) && (line.match(hrreg) || []).length >= 3) {
            line = '<hr id="line">';
        }
        else {
            line = !flag ? "<p>".concat(line, "</p>") : line;
        }
        // links
        words = line.match(linkreg);
        words
            ? words.forEach(function (word, index) {
                var innerhtml = "";
                var href = "";
                var array = word.split("](");
                innerhtml = array[0].slice(1);
                href = array[1].slice(0, array[1].length - 1);
                line = line.replace(word, "<a href=\"".concat(href, "\">").concat(innerhtml, "</a>"));
            })
            : null;
        body += line + "\n";
    });
    return body;
};
