import walkes from "walkes";
import { transform } from "buble";
import transformOneImport from "./transformOneImport";
import normalizeSfcComponent from "./normalizeSfcComponent";
import getAst from "./getAst";

export function isCodeVueSfc(code) {
  return /\n\W*<script/.test(code);
}

function transformImports(code) {
  let offset = 0;
  walkes(getAst(code), {
    ImportDeclaration(node) {
      const ret = transformOneImport(node, code, offset);
      offset = ret.offset;
      code = ret.code;
    }
  });
  return code;
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param {string} code
 * @return {script:String, html:String}
 *
 */
export default function compileCode(code, style, importTransformed) {
  let index;
  const lines = code.split("\n");
  if (code.indexOf("new Vue") > -1) {
    return {
      script: importTransformed ? code : transformImports(code),
      style
    };
  } else if (isCodeVueSfc(code)) {
    const transformed = normalizeSfcComponent(code);
    return compileCode(transformed.component, transformed.style, true);
  }
  for (let id = 0; id < lines.length; id++) {
    if (lines[id].trim().charAt(0) === "<") {
      index = id;
      break;
    }
  }
  return {
    script: transform(
      transformImports(
        lines
          .slice(0, index)
          .join("\n")
          .trim()
      )
    ).code,
    html: lines.slice(index).join("\n")
  };
}
