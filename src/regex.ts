const bolditalicreg = /(\*\*\*[^\*]+\*\*\*)|(\*\*\_[^\*]+\_\*\*)/g;
const italicreg = /\*[^\*]+\*/g;
const boldreg = /\*\*[^\*]+\*\*/g;
const nothrreg = /[^- ]+/g;
const hrreg = /\-/g;
const codereg = /`[^`]+`/g;
const altcodereg = /```[^`]+```/g;
const multicodereg = /(^|\n)```\n[^`]*\n```($|\n)/g;
const olreg = /^[1-9][0-9]*\. .*/; // first occurrence
const ulreg = /^\* .*/; // first occurrence
const linkreg = /\[[^\[^\]]*\]\([^ ^\[^\]]*\)/g;
const imagereg = /\!\[[^\[^\]]*\]\([^\[^\]]*\)/g;
const strikethroughreg = /~~[^~]*~~/g;

export {
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
};
