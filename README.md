# RestFull API menggunakan Express dan MongoDB

## Setup Middleware yang biasa digunakan

### middleware itu apa sih ?

> fungsi/method yang menjembatani request HTTP dan response, biasanya digunakan untuk melakukan authentifikasi, validasi inputan dan lain-lain.

beberapa buildin middlware express yang sering digunakan :

1. `express.json()` => memparsing request HTTP dengan content type aplication/json menjadi JSON, ketika kita melakukan HTTP method POST, PUT atau PATCH akan di simpan pada object request.body
2. `express.urlencoded()` => memparsing request HTTP dengan content type aplication/x-www-form-urlencoded, ketika kita melakukan HTTP method POST, PUT atau PATCH akan di simpan pada object request.body

implematasi dalam code

```js
//app.js
...

app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));

...
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository ke version controll git, ketikan perintah

```console
git add .
```

melakukan commit perubahan pada git

```console
git commit -m "setup-middleware-express"
```

mengupload ke repository github

```console
git push origin setup-middleware-express
```
