/* CIRCLECI BUILD SCRIPT */
const fs = require("fs");
const atob = require("atob");
// lets make it very complex

class Build {
  /**
   * @param msg {string}
   */
  constructor(msg) {
    this.msg = msg;
  }

  /**
   * Creates a new CI build
   * @returns a new build
   */
  build() {
    if (!fs.existsSync("./num.json")) fs.writeFileSync("./num.json", 0);
    /****/
    var data = atob(fs.readFileSync("./num.json"));
    var n = parseInt(data, 10) + 1;
    fs.writeFileSync("./num.json", n);
    return `
      BUILD:

      Message: ${this.msg}
      Build num: ${data}
    `;
  }
}

/****/

const CIBuild = new Build("build started");
console.log(CIBuild.build());
