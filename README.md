# RestFull API menggunakan Express dan MongoDB

## Membuat version control menggunakan git

Buka terminal lalu ketik perintah :

```console
git init
```

## Membuat project NodeJs

Buka terminal lalu ketik perintah :

```console
npm init
```

akan muncul file <mark>package.json</mark>, tambahkan konfigurasi berikut :

```js
//package.json
{
  "name": "server",
  "version": "1.0.0",
  "description": "Restfull API Typ! Blog",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC"
}
```

1. <mark>"description" : "Restfull API Typ! Blog"</mark> Menambahkan Description
2. <mark>"type" : "module"</mark> memberitahu nodeJs bahwa kita akan menggunakan format ES module (export import), secara default menggunakan "commonJs (required)
3. <mark>"start" : "node index.js"</mark> membuat script start untuk menjadlankan code

Jangan lupa buat file <mark>index.js</mark> yang akan kita gunakan sebagai main code

```console
touch index.js
```

akan muncul file <mark>index.js</mark>, coba kita isikan dengan code

```js
//index.js
console.log("Hello Word!");
```

lalu jalankan perintah

```console
npm start
```

## Membuat server menggunakan ExpressJs

Instal package <mark>express</mark>

```console
npm instal express --save
```

setiap kita menginstall package maka akan terdaftar di <mark>package.json</mark> pada field dependencies

```js
{
  "name": "server",
  "version": "1.0.0",
  "description": "Restfull API Typ! Blog",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.3"
  }
}
```

buka file <mark>index.js</mark>

membuat aplication dengan express

```js
//index.js
import express from "express";

const app = express();
const PORT = 5500;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

membuat example http method GET

```js
//index.js
...

app.get("/", (req, res) => {
    res.send("Hello Express");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

membuat file <mark>.gitignore</mark>, untuk mencegah file/folder terupload ketika kita upload ke github, contohnya node_module karna akan memperbesar ukuran repository kita

```console
touch .gitignore
```

dan isikan

```
node_module
```
