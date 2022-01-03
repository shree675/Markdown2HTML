const fetch = require("node-fetch");
const fs = require("fs");
const zipper = require("zip-local");
const chalk = require("chalk");
import { exit } from "process";

const baseurl = "https://api.netlify.com/api/v1/";

var input = "";
var readline: any;

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
  stats = fs.statSync(file);
  fileSizeInBytes = stats.size;
  fileStream = fs.createReadStream(file);

  return { fileSizeInBytes, fileStream };
}

const deploy = async () => {
  const read = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline = read;

  var deployedUrl = "";
  var stats;
  console.log(
    chalk.yellow("Note: ") +
      "If you have used " +
      chalk.cyan("ssg create") +
      " to create your book, please verify that all the links, images, etc. work correctly in all the created pages before deployment."
  );
  console.log();

  await query("Do you want to deploy to an existing site? " + chalk.grey("[y/N] "));
  if (input.toLowerCase().trim()[0] === "y") {
    var siteid;

    await query("Please enter the site id: ");
    siteid = input;
    stats = await createZip(siteid);
    deployedUrl = await deployZip(siteid, stats.fileSizeInBytes, stats.fileStream);
  } else {
    var siteId = "";

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
        siteId = data.site_id;
      })
      .catch((err: any) => {
        console.log(err);
      });
    console.log("Your site id is: " + chalk.purple(siteId));
    console.log(
      chalk.yellow("Note: ") +
        "Please save this site id for further use. In case you want to update the contents of this book, use this site id to update the site."
    );
    stats = await createZip(siteId);
    deployedUrl = await deployZip(siteId, stats.fileSizeInBytes, stats.fileStream);
  }

  console.log(chalk.green("Deployed successfully!"));
  console.log("Check out your book here:");
  console.log(chalk.purple(deployedUrl));
  deleteFile(siteid ?? "");
  readline.close();
  exit();
};

const deployZip = async (siteid: string, fileSizeInBytes: any, fileStream: any): Promise<string> => {
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
      deleteFile(siteid);
      exit();
    });
  return deployedUrl;
};

const deleteFile = (siteid: string) => {
  if (fs.existsSync(`${siteid}.zip`)) {
    fs.unlinkSync(`${siteid}.zip`);
  }
};

export { deploy };

// f5f7f301-a04b-4c8c-8198-05221c24eb8d
// cranky-shockley-4c3025.netlify.app

// 41495f37-670b-47fd-b3cb-a42a0abe21b5
// jovial-wilson
