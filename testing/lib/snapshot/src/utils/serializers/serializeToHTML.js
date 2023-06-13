const stripTransientIdAttributes = require("./stripTransientIdAttributes");
const beautify = require("js-beautify").html;

module.exports = (el$) => {
  const html = el$[0].outerHTML;
  const stripped = stripTransientIdAttributes(html);
  const options = {
    wrap_line_length: 80,
    indent_inner_html: true,
    indent_size: 2,
    wrap_attributes: "force",
  };
  const pretty = beautify(stripped, options);
  return pretty;
};
