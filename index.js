#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
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

program
  .command("init")
  .description("Creates a `packages` directory")
  .action(() => {init()})

program
  .command("install <package> <version>")
  .description("Install a package")
  .action((package, version) => {fetchPackage(package, version)});

program
  .command("uninstall <package>")
  .description("Uninstall a package")
  .action((package) => {uninstall(package)})

program.parse(process.argv);