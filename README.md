# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Auth Register

membuat branch 4.endpoint/auth-register dan pindah ke branch :

```console
git checkout -b 4.endpoint/auth-register
```

install package `mongoose` sebagai ODM (Object Data Modeling) untuk mongoDB

```console
npm install mongoose
```

membuat konfigurasi koneksi database dengan mongoose

daftarkan url mongoDB pada file `.env`

```console
PORT=5500
MONGODB_URL=mongodb://127.0.0.1:27017/blog_typi
```

membuat folder configs dan membuat file `db.js` didalamnya

membuat module `connectDb`

```js
//db.js
import mongoose from "mongoose";
import utils from "../utils/index.js";
const connectDb = async () => {
    try {
        await mongoose.connect(utils.getEnv("MONGODB_URL"));
        console.log("MongoDB Connected!");
    } catch (error) {
        console.log("Connect MongoDB Error", error);
    }
};

export default { connectDb };
```

jalankan `connectDb` di `app.js`

```js
//app.js
import express from "express";
import db from "./src/configs/db.js";
import utils from "./utils/index.js";

const app = express();
const PORT = utils.getEnv("PORT");

db.connectDb();

app.use(express.json({ limit: "2MB" }));
```

secara default `nodeJS` tidak melakukan hot reload apabila ada perubahan pada code yang sedang berjalan.

untuk mengatasi problem itu , install package `nodemon` sebagai development dependencies.

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
    "bcrypt": "^5.1.1",
    "express": "^4.18.3",
    "joi": "^17.12.2",
    "mongoose": "^8.2.0",
    "dotenv": "^16.4.5"
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

membuat `schema user`

membuat folder schemas dan membuat file `userSchema.js` di dalamnya

```js
//userSchema.js
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

beberapa package yang akan digunakan

-   `bcrypt` => untuk mengenkripsi data sensitif, seperti password, agar tidak terekspos secara bebas.
-   `joi` => untuk validasi data inputan.

```console
npm i bcrypt joi
```

buat file `routers.js` dan buat router HTTP Method `POST` dengan path `/auth/register`

```js
//routers.js
import { Router } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import userSchema from "./schemas/userSchema.js";
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
            const existUser = await userSchema.findOne({
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
            //object create
            const createData = {
                ...input,
                password: hashedPassword,
            };

            //insert database
            await userSchema.create(createData);
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

daftarkan semua router sebagai middleware di main `app.js` dengan path `/api/v1`

```js
//app.js
import express from "express";
import db from "./src/configs/db.js";
import utils from "./utils/index.js";
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
git commit -m "add endpoint auth register"
```

mengupload ke repository github

```console
git push origin 4.endpoint/auth-register
```

## Membuat code menjadi modular

agar code yang kita buat lebih terstruktur, mudah dibaca, meminimalisir duplikasi kode dan mudah dimaintance, kita pisahkan kode kita menjadi module-modul terpisah sesuai dengan konteksnya.

1.  membuat utils handlerResponse

```js
//utils/index.js
...
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

const handlerResponse = (res, type = "", additionalData = {}) => {
    const httpCodeResponse = getHttpCodeResponse(type);
    return res
        .status(httpCodeResponse.code)
        .json({
            ...httpCodeResponse,
            ...additionalData,
        })
        .end();
};

export default { getEnv, handlerResponse };
```

2. membuat utils validationInput

```js
//utils/index.js
...
const validationInput = (req, res, next, joiSchema, input) => {
    try {
        //if joinSchema and input empty
        if (!joiSchema || !input) {
            throw Error("schema and input is reqiured!");
        }
        const { error } = joiSchema.validate(input);
        //if error return status 400
        if (error) {
            throw Error(error.details.at(0).message);
        }
        //next process
        next();
    } catch (error) {
        //if error
        return handlerResponse(res, `BAD_REQUEST`, {
            message: `Validation Error : ${error}`,
        });
    }
};
export default { getEnv, handlerResponse, validationInput };
```

3. membuat folder validations dan membuat file `authValidation.js` didalamnya

```js
//authValidation.js
import Joi from "joi";
import utils from "../utils/index.js";

const register = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().min(8).required(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { register };
```

1. membuat folder controllers dan membuat file `authController.js` didalamnya

```js
//authController
import bcrypt from "bcrypt";
import userSchema from "../schemas/userSchema.js";
import utils from "../utils/index.js";

const register = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
        const existUser = await userSchema.findOne({
            username: input.username,
        });
        //if user found
        if (existUser) {
            return utils.handlerResponse(res, "BAD_REQUEST", {
                message: "User is exist, get to Login!",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        //object create
        const createData = {
            ...input,
            password: hashedPassword,
        };

        //insert in database
        await userSchema.create(createData);
        //return response
        return utils.handlerResponse(res, "CREATED", {
            message: "Register Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register };
```

jangan lupa rubah middleware dan controller di endpoint routernya seperti berikut:

```js
import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
const router = Router();

//auth
router.post("/auth/register", authValidation.register, authController.register);

export default router;
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
git push origin 4.endpoint/auth-register
```
