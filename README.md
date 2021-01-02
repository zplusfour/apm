## The **A**ardvark programming language **P**ackage **M**anager

**CI:**<br>
[![Build status](https://ci.appveyor.com/api/projects/status/a8y65qw59q4dr0hl?svg=true)](https://ci.appveyor.com/project/zplusfour/apm)

The Aardvark programming language package-manager/cli !<br>
**DOWNLOAD**: https://github.com/zplusfour/apm/releases/


## Documentation
**NOTE**: Once you've installed APM, you should edit your environment variables to use APM as a cli.

### 1. Create a project

If you aren't interested in packages, and you need to make your own package, you can skip to [this part](#developer-tools)
***
Type this command in your terminal, to initialize the `/packages` folder.

```sh
$ apm init
```
and then check out your file tree, and you'll see a `packages` folder.

### 2. Install a package

To choose what package you need to install, go to [https://registry.zdev1.repl.co](https://registry.zdev1.repl.co) to see the current packages

For example https://registry.zdev1.repl.co/package/std/1.0.0/main.adk (NOTE: std package is not done, all the packages aren't done because the language is not done too).

Type in the terminal:

```sh
$ apm install <pkg>@<version>
```

and then check your `packages` folder, you'll see your package and in your package folder you'll have the package files.

### 3. Uninstall a package

To uninstall a package, type in the terminal:

```sh
$ apm uninstall <pkg>
```

### 4. Publish a package

We have added a feature, you can publish packages with apm!

```sh
$ apm publish pkgname@version
```

and then you can install it by doing:

```sh
$ apm install pkgname@version
```


## Developer Tools

After you learned Aardvark, do you have any ideas for a project? well, no problem, you can publish your Aardvark packages!<br>
--> https://registry.zdev1.repl.co/publish (we'll work on styling later)

Name your package, add your version, and attach your `.adk` files! yes! you can attach multiple files!


## Closing

I hope you enjoy Aardvark, thank you so much for reading this! Have a good day!