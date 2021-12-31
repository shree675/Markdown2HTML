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
    return "<!doctype html>\n<html>\n<head>\n\t<meta charset=\"utf-8\">\n\t<title>".concat(title, "</title>\n\t<meta name=\"description\" content=\"").concat(title, "\">\n\t<link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n");
};
var footer = "</body>\n</html>\n";
var input = "";
var path = "";
var dir = "";
function query(query) {
    return new Promise(function (resolve) {
        return readline.question(query, function (p) {
            input = p;
            resolve(p);
        });
    });
}
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mdraw, lines, format, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mdraw = "";
                lines = [];
                return [4 /*yield*/, query("Enter name of the new folder: ")];
            case 1:
                _a.sent();
                dir = input;
                return [4 /*yield*/, fsprm.mkdir(dir).catch(function (err) {
                        console.log(chalk_1.default.red("ERR: ") + err.message);
                        readline.close();
                        (0, process_1.exit)();
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, query("Enter the title of the page: ")];
            case 3:
                _a.sent();
                title = input;
                return [4 /*yield*/, query("Path of the md file " + chalk_1.default.grey("[relative path]: "))];
            case 4:
                _a.sent();
                path = input;
                readline.close();
                format = path[0] === "/" || path[0] === "." ? "" : "/";
                return [4 /*yield*/, fsprm.readFile(process.cwd() + "/" + format + path, function (err, data) {
                        if (err) {
                            console.log(chalk_1.default.red("ERR: ") + err.message);
                            (0, process_1.exit)();
                        }
                        return data;
                    })];
            case 5:
                mdraw = _a.sent();
                mdraw = mdraw.toString();
                lines = mdraw.split("\n");
                for (i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].replace("\r", "");
                }
                return [4 /*yield*/, fsprm.writeFile(dir + "/index.html", header(title) + footer).catch(function (err) {
                        console.log(chalk_1.default.red("ERR: ") + err.message);
                        (0, process_1.exit)();
                    })];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.init = init;
