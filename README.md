# RestFull API menggunakan Express dan MongoDB

## Setup Middleware yang biasa digunakan

membuat branch 3.setup-variable-environment dan pindah ke branch :

```console
git checkout -b "3.setup-variable-environment"
```

### environment varible itu apa sih ?

> variable yang diset dalam konfigurasi aplikasi. biasanya digunakan untuk menyimpan informasi yang rahasia. contohnya port, url databas, secret key dan lain lain.

membuat file `.env` di root folder aplikasi

```js
//.env
PORT = 5500;
```

agar aplikasi dapat membaca variable yang ada di dalam `.env`, kita perlu menginstal package `dotenv`

```console
npm i dotenv

```

buat folder utils di folder src dan buat file `index.js` didalamnya

```js
// utils/index.js
import dotenv from "dotenv";
const getEnv = (key = "") => {
    dotenv.config();
    return process.env[`${key}`];
};

export default { getEnv };
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository ke version controll git, ketikan perintah

```console
git add .
```

melakukan commit perubahan pada git

```console
git commit -m "setup varible environment"
```

mengupload ke repository github

```console
git push origin 3.setup-variable-environment
```
