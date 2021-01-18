#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const Path = require("path");
const colors = require('colors');
const fetch = require('node-fetch');
const PACKAGE_URL = "https://registry010.theboys619.repl.co/package";

/**
 * @param err {string} Error
 * @param type {string} Error type
 * @returns {string}
 */

function ApmError(err, type) {
  console.log(`${type.underline.red}: ${err}`);
}

/**
 * @param pkg {string} Package name
 * @param v {string} Package version
 * @returns {Promise<void>}
 */

async function fetchPackage(pkg, v) {
  const fullname = `${pkg}@${v}`
  const p = (await fetch(`${PACKAGE_URL}/${fullname}/`)).json()
  .catch((err) => ApmError('Could not fetch this package', 'ApmError'));
}

/**
 * @returns {string} Creates a new project
 */

function init() {
  if (fs.existsSync("./packages")) return console.log("Already initialized!".underline.yellow);

  fs.mkdirSync('./packages');
  console.log("Done!".underline.green);
}

/**
 * @param pkg Package name
 * @returns {string} Uninstalls a package
 */

function uninstall(pkg) {
  fs.readdir(`./packages/${pkg}`, (err, data) => {
    if(err) ApmError("Cannot find this package", 'PackageError');

    for (const mod of data) {
      fs.unlinkSync(`./packages/${pkg}/${mod}`);
    }
    
    fs.rmdir(`./packages/${pkg}`, (err) => {
      if(err) ApmError("We went into package deletion errors", "PackageDeletionError");
      else{
        console.log("Done!".underline.green);
      }
    });
  });
}

/**
 * @param path {string} Path to `.apmignore`
 * @returns Reads the `.apmignore` file
 */

function readIgnoreFile(path = "./.apmignore") {
  if (!fs.existsSync(path)) return [];
  const fileData = fs.readFileSync(path, "UTF-8");
  const paths = fileData.replace(/\r/g, "").split("\n");

  return paths.map(ignoreFile => Path.resolve(path.replace(".apmignore", ""), ignoreFile));
}

/**
 * @param path {string} Path to directory
 * @param ignoreFiles {[]} `apmignore` files list in the current directory
 * @returns {typeof newFiles} newfiles
 */

function readDir(path = ".", ignoreFiles = []) {
  const files = fs.readdirSync(path, { withFileTypes: true });
  const newFiles = [];

  if (ignoreFiles.length < 1)
    ignoreFiles = readIgnoreFile(Path.resolve(path, ".apmignore"));

  for (const file of files) {
    const filePath = Path.resolve(path, file.name);

    if (file.name == ".git" || ignoreFiles.includes(filePath) || file.name == "node_modules") continue;
    if (file.isDirectory()) {
      newFiles.push({ type: "Directory", name: file.name, files: readDir(filePath, ignoreFiles) });
    } else if (file.isFile()) {
      newFiles.push({
        type: "File",
        name: file.name,
        data: fs.readFileSync(filePath, "utf-8")
      });
    }
  }

  return newFiles;
}

/**
 * @param pkgname {string} Package name
 * @param version {string} Package version
 * @param files {string[]} Package files
 * @returns {Promise<void>}
 */

async function publish(pkgname, version, files) {
  const URL = 'https://registry010.theboys619.repl.co/api/upload';

  const data = {
    pkgname,
    version,
    files
  };

  const req = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then((res) => res.text()).then((body) => {return body}).catch((err) => {return err});
}

program
  .command("init")
  .description("Creates a `packages` directory")
  .action(() => {init()})

program
  .command("install <package>")
  .description("Install a package")
  .action((pkg) => {
    pkg = pkg.split("@");
    try{
      fetchPackage(pkg[0], pkg[1])
    } catch (err) {
      ApmError('Could not add package', 'PackageInstallationError');
    }
  });

program
  .command("uninstall <package>")
  .description("Uninstall a package")
  .action((pkg) => {uninstall(pkg)})

program
  .command("publish <package> [path]")
  .description("Publish a package")
  .action((pkg, path = ".") => {publish(pkg.split("@")[0], pkg.split("@")[1], readDir(path))})

program.parse(process.argv);