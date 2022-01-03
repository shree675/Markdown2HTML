const fetch = require("node-fetch");
const zipper = require("zip-local");
import { exit } from "process";

var baseurl= "https://api.vercel.com";

const deploy = async () => {
  fetch(`https://api.netlify.com/api/v1/sites/41495f37-670b-47fd-b3cb-a42a0abe21b5/deploys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/zip",
      Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
    },
    body: "./stabc.gz",
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      console.log(data);
      exit();
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export { deploy };

// f5f7f301-a04b-4c8c-8198-05221c24eb8d
// cranky-shockley-4c3025.netlify.app

// 41495f37-670b-47fd-b3cb-a42a0abe21b5
// jovial-wilson
