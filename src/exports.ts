const header = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n`;
};

const headerPage = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="../styles.css">\n</head>\n<body>\n`;
};

const footerNext = (next: string) => {
  return `<div id="footer">\n<a href="${next}" id="next-button">Next</a>\nPage created by <a href="https://github.com/shree675/Markdown2HTML" target="_blank">ssg</a>, 2022\n</div>\n</body>\n</html>\n<br></br>\n<br></br>\n`;
};

const indexHeader = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>test page</title>\n<meta name="description" content="test page">\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<div id="content">\n<div id="title"><u>\n${t}\n</u></div>\n<br></br>\n<h1 style="text-align: center;">Index</h1>\n`;
};

const footer = `<div id="footer">\nPage created by <a href="https://github.com/shree675/Markdown2HTML" target="_blank">ssg</a>, 2022\n</div>\n</body>\n</html>\n<br></br>\n<br></br>\n`;

export { header, headerPage, indexHeader, footerNext, footer };
