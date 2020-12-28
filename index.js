#!/usr/bin/env node
const program = require('commander');
//const colors = require('colors');
const fs = require('fs');
const fetch = require('node-fetch');

function ApmError(err, type) {
  console.log(`${type}: ${err}`);
}

async function fetchPackage(pkg, v) {
  const p = await fetch(`https://registry.zdev1.repl.co/package/${pkg}/${v}/main.adk`).then(res => res.text()).then((body) => {
    fs.writeFile(`./packages/${pkg}.adk`, body, (err) => {if(err)  ApmError(err, 'FileCreationError')})
  })
  .catch((err) => ApmError(err, 'ApmError'));
}

function init() {
  fs.mkdirSync('./packages');
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
  .action((package) => {fs.unlinkSync(`./packages/${package}.adk`)})

program.parse(process.argv);