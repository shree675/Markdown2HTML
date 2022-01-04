const fetch = require("node-fetch");
const fs = require("fs");
const zipper = require("zip-local");
const chalk = require("chalk");
const figlet = require("figlet");
import { exit } from "process";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseurl = "https://api.netlify.com/api/v1/";

var input = "";
var readline: any;
var siteid = "";

function query(query: string) {
  return new Promise((resolve) =>
    readline.question(query, (p: any) => {
      input = p;
      resolve(p);
    })
  );
}

async function createZip(siteid: string): Promise<any> {
  var file;
  var stats;
  var fileSizeInBytes;
  var fileStream;

  await query("Please enter the path to your folder: " + chalk.grey("[relative path] "));
  file = input;
  if (!fs.existsSync(file)) {
    console.log(chalk.red("ERR: ") + "Folder not found/path is invalid");
    return await createZip(siteid);
  }
  zipper.sync.zip(file).compress().save(`${siteid}.zip`);
  stats = fs.statSync(`${siteid}.zip`);
  fileSizeInBytes = stats.size;
  fileStream = fs.createReadStream(`${siteid}.zip`);
  return { fileSizeInBytes, fileStream };
}

const deploy = async () => {
  var deployedUrl = "";
  var stats;

  const read = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline = read;

  console.log(
    chalk.yellow("Note: ") +
      "If you have used " +
      chalk.cyan("ssg create") +
      " to create your book, please verify that all the links, images, etc. work correctly in all the created pages before deployment."
  );
  console.log();
  await query("Do you want to deploy to an existing site? " + chalk.grey("[y/N] "));
  if (input.toLowerCase().trim()[0] === "y") {
    await query("Please enter the site id: ");
    siteid = input;
    stats = await createZip(siteid);
    deployedUrl = await deployZip(stats.fileSizeInBytes, stats.fileStream);
  } else {
    await fetch(`${baseurl}sites`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
      },
    })
      .then((response: any) => {
        return response.json();
      })
      .then((data: any) => {
        siteid = data.site_id;
      })
      .catch((err: any) => {
        deleteFile();
        console.log(chalk.red("ERR: ") + err.message);
        exit();
      });
    console.log("Your site id is: " + chalk.rgb(250, 150, 0)(siteid));
    console.log(
      chalk.yellow("Note: ") +
        "Please save this site id for further use. In case you want to update the contents of this book, use this site id to update the site."
    );
    stats = await createZip(siteid);
    deployedUrl = await deployZip(stats.fileSizeInBytes, stats.fileStream);
  }
  console.log(chalk.green("Deployed successfully!"));
  console.log("Check out your book here: " + chalk.rgb(128, 0, 128).underline(deployedUrl));
  deleteFile();
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

const deployZip = async (fileSizeInBytes: any, fileStream: any) => {
  var deployedUrl = "";

  await fetch(`${baseurl}sites/${siteid}/deploys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/zip",
      "Content-length": fileSizeInBytes.toString(),
      Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
    },
    body: fileStream,
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      deployedUrl = data.url;
    })
    .catch((err: any) => {
      console.log(chalk.red("ERR: ") + err.message);
      deleteFile();
      exit();
    });
  return deployedUrl;
};

const deleteFile = () => {
  if (fs.existsSync(`${siteid}.zip`)) {
    fs.unlinkSync(`${siteid}.zip`);
  }
};

export { deploy };
