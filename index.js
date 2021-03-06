const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");
/////////////////////////////////////////
// FILE

// Blocking Code
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

// const textOut =
//   "chiklasa paad maara chiklasa gandh maara , achi lagi moree aaaaaaaaaa thodaa aajana aake thodaaaa ";
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("done");

// Non Blocking Code
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile("./txt/" + data1, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", data2 + data3, (err) => {
//         console.log("YOUR FILE IS WRITTEN");
//       });
//     });
//   });
// });

// console.log("Reading file start.txt");

//////////////////////////////
// SERVER
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const overview = fs.readFileSync("./templates/overview.html", "utf-8");
const product = fs.readFileSync("./templates/product.html", "utf-8");
const card = fs.readFileSync("./templates/card.html", "utf-8");

const server = http.createServer((req, response) => {
  //console.log(req);

  //overview page
  const { pathname, query } = url.parse(req.url, true);

  console.log(query);
  console.log(pathname);

  if (pathname === "/overview" || pathname === "/") {
    response.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(card, el)).join("");

    const output = overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    response.end(output);
  }

  //api page
  else if (pathname === "/api") {
    response.writeHead(200, {
      "content-type": "application/json",
    });
    response.end(data);
  } else if (pathname === "/product") {
    const temp = dataObj[query.id];

    output = replaceTemplate(product, temp);
    response.writeHead(200, {
      "Content-type": "text/html",
    });
    response.end(output);
  }

  //not found page
  else response.end("No such page exists da");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Requesting on Server");
});
