# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Auth Register

membuat branch 3.endpoint/auth-register dan pindah ke branch :

```console
git checkout -b 3.endpoint/auth-register
```

install package `mongoose` sebagai ODM (Object Data Modeling) untuk mongoDB

```console
npm install mongoose
```

membuat konfigurasi koneksi database dengan mongoose

membuat folder configs dan membuat file `db.js` didalamnya

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

jalankan connectDb di app.js

```js
//app.js
import express from "express";
import db from "./src/configs/db.js";

const app = express();
const PORT = 5500;

db.connectDb();

app.use(express.json({ limit: "2MB" }));

...
```

kok tidak jalan ya connectDbnya ?, secara default nodeJS tidak melakukan hot reload apabila ada perubahan pada code yang sedang berjalan.

untuk mengatasi problem itu , install package `nodemon` sebagai development dependencies.

```console
npm i -g nodemon -D
```

tambahan script baru , dengan command dev

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
        "start": "node src/app.js",
        "dev": "nodemon src/app.js"
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

membuat folder schemas dan membuat file `usersSchema.js` di dalamnya

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

-   `bcrypt` => untuk mengenkripsi data sensitif, seperti password, agar tidak terekspos secara bebas.
-   `joi` => untuk validasi data inputan.

```console
npm i bcrypt joi
```

buat file routers dan buat router HTTP Method `POST` dengan path `auth/register`

```js
//routers.js
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
            const existUser = await usersSchema.findOne({
                username: input.username,
            });
            //if user found
            if (existUser) {
                return res
                    .status(400)
                    .json({
                        status: "error",
                        message: "User is exist, get to Login!",
                        code: 400,
                    })
                    .end();
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
            return res
                .status(201)
                .json({
                    status: "success",
                    message: "Register Success!",
                    code: 201,
                })
                .end();
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

daftarkan semua router di main `app.js` dengan patch `/api/v1` sebagi middleware

```js
//app.js
import express from "express";
import db from "./src/configs/db.js";
import router from "./src/routers.js";

...
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
...
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint register"
```

mengupload ke repository github

```console
git push origin 3.endpoint/auth-register
```

## Membuat code menjadi modular

agar code yang kita buat lebih terstruktur, mudah dibaca, meminimalisir duplikasi kode dan mudah dimaintance, kita pisahkan kode kita menjadi module-modul terpisah sesuai dengan konteksnya.

1. membuat folder helpers dan membuat file `handlerResponseHelper.js` didalamnya

```js
//handlerResponseHelper.js
const getHttpCodeResponse = (type = "") => {
    switch (type) {
        case "OK":
            return { code: 200, status: "success" };
        case "CREATED":
            return { code: 201, status: "success" };
        case "BAD_REQUEST":
            return { code: 400, status: "error" };
        case "UNAUTHORIZED":
            return { code: 401, status: "error" };
        case "INTERNAL_ERROR":
            return {
                code: 500,
                status: "error",
                message: "internal server error",
            };
        default:
            return {
                code: 500,
                status: "error",
                message: "internal server error",
            };
    }
};

export const handlerResponseHelper = (res, type = "", additionalData = {}) => {
    const httpCodeResponse = getHttpCodeResponse(type);
    return res
        .status(httpCodeResponse.code)
        .json({
            ...httpCodeResponse,
            ...additionalData,
        })
        .end();
};
```

2. membuat file `validationInputHelper.js` didalam folder helpers

```js
//validationInputHelper.js
import { handlerResponseHelper } from "./handlerResponseHelper.js";

export const validationInputHelper = (req, res, next, joiSchema, input) => {
    try {
        if (!joiSchema || !input) {
            throw Error("schema and input is reqiured!");
        }
        const { error } = joiSchema.validate(input);
        //if error return status 400
        if (error) {
            throw Error(error.details.at(0).message);
        }
        next();
    } catch (error) {
        return handlerResponseHelper(res, `BAD_REQUEST`, {
            message: `Validation Error : ${error}`,
        });
    }
};
```

3. membuat folder validations dan membuat file `authValidation.js` didalamnya

```js
//authValidation.js
import Joi from "joi";
import { validationInputHelper } from "../helpers/validationInputHelper.js";
const register = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().min(8).required(),
    });
    return validationInputHelper(req, res, next, schema, input);
};

export default { register };
```

1. membuat folder controllers dan membuat file `authController.js` didalamnya

```js
//authController
import bcrypt from "bcrypt";
import usersSchema from "../schemas/usersSchema.js";
import { handlerResponseHelper } from "../helpers/handlerResponseHelper.js";
const register = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
        const existUser = await usersSchema.findOne({
            username: input.username,
        });
        //if user found
        if (existUser) {
            return handlerResponseHelper(res, "BAD_REQUEST", {
                message: "User is exist, get to Login!",
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
        return handlerResponseHelper(res, "CREATED", {
            message: "Register Success!",
        });
    } catch (error) {
        //return response error
        return handlerResponseHelper(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register };
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "refactor code"
```

mengupload ke repository github

```console
git push origin 3.endpoint/auth-register
```
