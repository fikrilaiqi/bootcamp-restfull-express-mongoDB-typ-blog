# RestFull API menggunakan Express dan MongoDB

## Setup Middleware yang biasa digunakan

## Membuat endpoint Auth

install package `mongoose` sebagai ODM (Object Data Modeling) untuk mongoDB

```console
npm install mongoose
```

membuat konfigurasi koneksi database dengan mongoose

membuat folder src (source)

```console
mkdir src
```

masuk ke folder src

```console
cd src
```

membuat configs

```console
mkdir configs
```

masuk ke folder configs

```console
cd configs
```

membuat file db.js

```console
touch db.js
```

membuat module connectDb

```js
//db.js
import mongoose from "mongoose";
const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blog_typi");
        console.log("MongoDB Connected!");
    } catch (error) {
        console.log("Connect MongoDB Error", error);
    }
};

export default { connectDb };
```

jalankan connectDb di index.js

```js
//index.js
import express from "express";
import db from "./src/configs/db.js";

const app = express();
const PORT = 5500;

db.connectDb();

app.use(express.json({ limit: "2MB" }));

...
```

kok tidak jalan ya connectDbnya, secara default nodeJS tidak melakukan hot reload apabila ada perubahan pada code yang sedang berjalan.

untuk mengatasi problem itu , install package `nodemon` untuk development saja.

```console
npm i nodemon -D
```

tambahan script baru , dengan command dev

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
        "start": "node index.js",
        "dev": "nodemon index.js"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "express": "^4.18.3",
        "mongoose": "^8.2.0"
    },
    "devDependencies": {
        "nodemon": "^3.1.0"
    }
}
```

lalu jalankan ulang dengan perintah

```console
npm run dev
```

membuat `schema users`

masuk ke direktori src
membuat folder schemas dan membuat file `usersSchema.js` di dalam folder schemas

```console
mkdir schemas && cd schemas/  && touch usersSchema.js
```

membuat schema user

```js
//usersSchema.js
import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String, required: true },
        image: String,
    },
    { timestamps: true }
);

export default model("user", userSchema);
```

membuat router endpoint `auth/register`

beberapa package yang akan digunakan

-   bcrypt => untuk mengenkripsi data sensitif, seperti password, agar tidak terekspos secara bebas.
-   joi => untuk validasi data inputan.

membuat router `POST` dengan patch `auth/register`

```js
import { Router } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import usersSchema from "./schemas/usersSchema.js";
const router = Router();

router.post(
    "/auth/register",
    (req, res, next) => {
        try {
            const input = req.body;
            //validation input
            const schema = Joi.object({
                username: Joi.string().min(6).required(),
                password: Joi.string().min(6).required(),
                fullname: Joi.string().min(8).required(),
            });

            const { error } = schema.validate(input);
            //if error return status 400
            if (error) {
                return res
                    .status(400)
                    .json({
                        status: "error",
                        message: error.details.at(0).message,
                        code: 400,
                    })
                    .end();
            }
            next();
        } catch (error) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: `Validation Error : ${error}`,
                    code: 400,
                })
                .end();
        }
    },
    async (req, res) => {
        try {
            const input = req.body;

            //find user exist,  hide password and timestamp
            const existUser = await usersSchema.findOne(
                {
                    username: input.username,
                },
                "-password -createdAt -updatedAt"
            );
            //if user found
            if (existUser) {
                return res.status(400).json({
                    status: "error",
                    message: "User is exist, get to Login!",
                    code: 400,
                });
            }
            //hash password
            const hashedPassword = await bcrypt.hash(input.password, 10);

            const createData = {
                ...input,
                password: hashedPassword,
            };

            //create user
            await usersSchema.create(createData);
            //return response
            return res.status(201).json({
                status: "success",
                message: "Register Success!",
                code: 201,
            });
        } catch (error) {
            //return response error
            return res
                .status(500)
                .json({
                    status: "error",
                    message: error?.message || error || "internal server error",
                    code: 500,
                })
                .end();
        }
    }
);
```

daftarkan semua router di main `index.js` sebagi middleware

```js
import express from "express";
import db from "./src/configs/db.js";
import router from "./src/routers.js";

...
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
...
```

```console
npm i bcrypt joi
```

masuk ke direktori src
buat file routers

```js

```

```console
 touch routers.js
```

masuk ke direktori src
membuat folder controllers dan membuat file `usersController.js` di dalam folder controllers

```console
mkdir controllers && cd controllers/  && touch usersController.js
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository ke version controll git, ketikan perintah

```console
git add .
```

melakukan commit perubahan pada git

```console
git commit -m "add endpoint register"
```

mengupload ke repository github

```console
git push origin endpoint/auth
```
