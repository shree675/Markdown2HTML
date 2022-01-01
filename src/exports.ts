const header = (t: string) => {
  return `<!doctype html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<title>${t}</title>\n\t<meta name="description" content="${t}">\n\t<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n`;
};

const footer = `</body>\n</html>\n`;

export { header, footer };
