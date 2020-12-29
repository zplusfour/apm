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
      if(err) ApmError(err, 'ModuleCreationError');
    });
    body.forEach(async (mod) => {
      const modata = await fetch(`${PACKAGE_URL}/${pkg}/${v}/${mod}`).then(res => res.text()).then((body) => {
        fs.writeFileSync(`./packages/${pkg}/${mod}`, body);
      })
    });
  })
  .catch((err) => ApmError(err, 'ApmError'));
}

function init() {
  fs.mkdirSync('./packages');
  console.log("Done!".underline.green);
}

function uninstall(pkg) {
  fs.rmdir('./packages/'+pkg, (err) => {
    if(err) ApmError(err, 'DirectoryDeletionError');
    else{
      console.log('Done!'.underline.green);
    }
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