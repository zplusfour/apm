#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const Path = require("path");
const colors = require('colors');
const fetch = require('node-fetch');
const PACKAGE_URL = "https://registry.zdev1.repl.co/package";

function ApmError(err, type) {
  console.log(`${type.underline.red}: ${err}`);
}

async function fetchPackage(pkg, v) {
  const p = await fetch(`${PACKAGE_URL}/${pkg}/${v}/`).then(res => res.json()).then((body) => {
    //fs.writeFile(`./packages/${pkg}.adk`, body, (err) => {if(err)  {ApmError(err, 'FileCreationError')}else{console.log("Done!".underline.blue);}});
    fs.mkdir(`./packages/${pkg}/`, (err) => {
      if(err) ApmError(err, 'PackageInstallationError');
    });
    body.forEach(async (mod) => {
      const modata = await fetch(`${PACKAGE_URL}/${pkg}/${v}/${mod}`).then(res => res.text()).then((body) => {
        fs.writeFileSync(`./packages/${pkg}/${mod}`, body);
      });
    });
  })
  .catch((err) => ApmError('Could not fetch this package', 'ApmError'));
}

function init() {
  if (fs.existsSync("./packages")) return console.log("Already initialized!".underline.yellow);

  fs.mkdirSync('./packages');
  console.log("Done!".underline.green);
}

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

function readIgnoreFile(path = "./.apmignore") {
  if (!fs.existsSync(path)) return [];
  const fileData = fs.readFileSync(path, "UTF-8");
  const paths = fileData.replace(/\r/g, "").split("\n");

  return paths.map(ignoreFile => Path.resolve(path.replace(".apmignore", ""), ignoreFile));
}

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
        name: file.name
      });
    }
  }

  return newFiles;
}

async function publish(pkgname, version, files) {
  const URL = 'https://registry.zdev1.repl.co/api/upload';

  const data = {
    pkgname,
    version,
    files
  };

  const pub = await fetch(URL, {
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