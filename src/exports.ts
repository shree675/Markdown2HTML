const header = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n`;
};

const headerPage = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="../styles.css">\n</head>\n<body>\n`;
};

const footerNext = (next: string) => {
  return `<div id="footer-next">\n<a href="${next}" id="next-button">Next</a>\n</div>\n` + footer;
};

const footer = `<div id="footer">\nEnd of book\n</div>\n<div id="footer">\nPage created by <a href="https://github.com/shree675/Markdown2HTML" target="_blank">ssg</a>, 2022\n</div>`;

export { header, headerPage, footerNext, footer };
