/* CIRCLECI BUILD SCRIPT */
const fs = require('fs');
const atob = require('atob');
// lets make it very complex

class Build {
  constructor(msg) {
    this.msg = msg;
  }

  build() {

    if (!fs.existsSync('./num.json')) fs.writeFileSync('./num.json', 0);
    /****/
    const data = atob(fs.readFileSync('./num.json'));

    data += 1;
    return (`
      BUILD:

      Message: ${this.msg}
      Build num: ${data}
    `)
  }
}

/****/

const CIBuild = new Build("build started");
console.log(CIBuild.build());