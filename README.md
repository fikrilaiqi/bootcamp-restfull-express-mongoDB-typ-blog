# RestFull API menggunakan Express dan MongoDB

## Membuat version control menggunakan git

Buka terminal lalu ketik perintah :

```console
git init
```

membuat branch init-server dan pindah ke branc :

```console
git checkout -b "init-server"
```

## Membuat project NodeJs

Buka terminal lalu ketik perintah :

```console
npm init
```

akan muncul file **package.json**, tambahkan konfigurasi berikut :

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

1. **"description" : "Restfull API Typ! Blog"** Menambahkan Description
2. **"type" : "module"** memberitahu nodeJs bahwa kita akan menggunakan format ES module (export import), secara default menggunakan "commonJs (required)
3. **"start" : "node index.js"** membuat script start untuk menjadlankan code

Jangan lupa buat file **index.js** yang akan kita gunakan sebagai main code

```console
touch index.js
```

akan muncul file **index.js**, coba kita isikan dengan code

```js
//index.js
console.log("Hello Word!");
```

lalu jalankan perintah

```console
npm start
```

## Membuat server menggunakan ExpressJs

Instal package **express**

```console
npm instal express --save
```

setiap kita menginstall package maka akan terdaftar di **package.json** pada field dependencies

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

buka file **index.js**

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

membuat file **.gitignore**, untuk mencegah file/folder terupload ketika kita upload ke github, contohnya node_module karna akan memperbesar ukuran repository kita

## Mendaftarkan history perubahan repository ke git dan upload ke github

```console
touch .gitignore
```

dan isikan

```
node_module
```

medaftarkan semua perubahan pada repository ke version controll git, ketikan perintah

```console
git add .
```

melakukan commit perubahan pada git

```console
git commit -m "init server"
```

mendaftarkan remote repository github pada repository git kita

```console
git remote add origin https://github.com/.....git
```

mengupload ke repository github

```console
git push origin init-server
```
