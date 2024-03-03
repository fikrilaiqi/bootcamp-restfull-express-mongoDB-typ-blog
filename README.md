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
  "main": "app.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/app.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
  }
}

```

1. `"description" : "Restfull API Typ! Blog"` => Menambahkan Description
2. `"type" : "module"` => memberitahu nodeJs bahwa kita akan menggunakan format ES module (export import), secara default menggunakan "commonJs (required)
3. `"start" : "node /src/app.js"` => membuat script start untuk menjalankan code

buat folder src dan buat file `app.js` didalam folder src, yang akan kita gunakan sebagai main code

```js
//app.js
console.log("Hello Word!");
```

lalu jalankan perintah

```console
npm start
```

## Membuat server menggunakan ExpressJs

Instal package `express`

```console
npm i express
```

setiap kita menginstall package maka akan terdaftar di **package.json** pada field dependencies

```js
{
  "name": "server",
  "version": "1.0.0",
  "description": "Restfull API Typ! Blog",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/app.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.3"
  }
}
```

buka file `app.js`

membuat aplication dengan express

```js
//app.js
import express from "express";

const app = express();
const PORT = 5500;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

membuat example http method GET

```js
//app.js
...

app.get("/", (req, res) => {
    res.send("Hello Express");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

membuat file **.gitignore**, untuk mencegah file/folder terupload ketika kita upload ke github, contohnya node_module karna akan memperbesar ukuran repository github kita

## Mendaftarkan history perubahan repository local dan upload ke github

```console
touch .gitignore
```

dan isikan

```
node_module
```

medaftarkan semua perubahan pada repository local kita, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "init server"
```

mendaftarkan remote repository github pada repository local kita

```console
git remote add origin https://github.com/.....git
```

mengupload branch init-server ke repository github

```console
git push origin init-server
```
