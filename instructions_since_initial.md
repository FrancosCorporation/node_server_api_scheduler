<h1 align="center">Welcome to the explanation for about create this api with Windows 😎</h1>

<h3 align="center"> [ 0 ✨] OF [ 10 ✔]</h3>

<h3 align="center"> Install NODE-JS</h3>

<center>

[@Node-JS](https://nodejs.org/pt-br/)

> After instalation Node you have Node and Npm

<h3>Test</h3>
<p>

```sh
Node -v
Npm -v
```

<br>

> Now install Yarn, this package manager will be responsible for add packages the project

```sh
npm install -g yarn
```

<br>

> Starting for create the file package.json

```sh
yarn init -y
```

<br><br>

> add this line in package.json for refresh fast

```sh
"dev": "ts-node-dev -r tsconfig-paths/register --respawn --transpile-only --ignore-watch node_modules --no-notify src/server.ts",
```

<br>

> "ts-node-dev -r"

#### Add fast reload for aplication for do compilation process between restarts.

<br>

<h3> -- Install ts-node-dev --</h3>

<br>

```sh
yarn add ts-node-dev -D
or
npm install ts-node-dev -D
```

<br>

<h3> -- Install Typescript --</h3>

<br>

```sh
yarn add typescript -D
or
npm install ts-node-dev -D
```

<br>

> "tsconfig-paths/register"

#### Allows the use of path mapping which allows arbitrary module paths (that doesn't start with "/" or ".") to be specified and mapped to physical paths in the filesystem.

<br>

<h3> -- Install Tsconfig-Paths --</h3>

<br>

```sh
yarn add tsconfig-paths -D
or
npm install tsconfig-paths -D
```

<br>

> "--respawn"

#### It's a flag , Works watching changes in project and start auto reload

<br>

> "--transpile-only"

#### It's a flag , Works Ignoring the correct or not in lines on the project the Eslint in vscode is same

<br>

> "--ignore-watch node_modules"

#### (It's a flag, with_name_folder), Works Ignoring the node_modules for the compilation, for refresh fast

<br>

> Create Folder SRC

#### main project create folder /src

<br>

<h3> -- Install Express --</h3>

<br>

```sh
yarn add express -D
or
npm install express -D
```

<h3> [ 1 ✨] OF [ 10 ✔]</h3>
<br>

> Start project

```sh
yarn dev
or
npm dev
```
<br>


