# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Auth Login

membuat branch 5.endpoint/auth-login dan pindah ke branch :

```console
git checkout -b 5.endpoint/auth-login
```

membuat modul login di file `authValidation.js`

```js
//authValidation.js
...
const login = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { register, login };
```

### jsonwebtoken

> jsonwebtoken/JWT adalah sebuah token berbentuk string panjang yang sangat random yang fungsinya untuk melakukan sistem Autentikasi dan Pertukaran Informasi dan tidak disarankan untuk menyimpan data sensitif pada token, seperti password. Nantinya akan kita gunakan sebagai identitas authentifikasi pada server.

ada 3 komponen dalam struktur JWT

-   `header` (algoritm & token type) => default configurasinya sperti berikut:

```js
{
    "alg": "HS256",
    "typ": "JTW"
}

```

-   `payload` => data yang akan dikirim, contohnya

```js
{
    "_id":"12334455",
    "username": "superadmin",
    "fullname" : "Super Admin"
}
```

-   `verify signature` => hasil hash gabungan header , payload dan secret key

```js
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    "your-256-bit-secret"
);
```

```console
npm i jsonwebtoken
```

membuat utils `createToken`

```js
//utils/index.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
...
const createToken = (payload = {}) => {
    const secret = getEnv("JWT_SECRET");
    return jwt.sign(payload, secret, {
        expiresIn: "24h",
    });
};

export default { getEnv, handlerResponse, validationInput, createToken };
```

membuat environment variable `JWT_SECRET` di file `.env` yang isinya random string

```
...
JWT_SECRET=ncFal4i3yIdfkSDSDijasa36nsd3
```

membuat modul login di file `authController.js`

```js
//authController.js
...
const login = async (req, res) => {
    try {
        const input = req.body;

        //find user exist
        const existUser = await userSchema.findOne({
            username: input.username,
        });
        //if user not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "User Not Found!",
            });
        }
        //convert toObject() to access value
        const { password: passUser, _id, ...rest } = existUser.toObject();
        //compare password in database with input password
        const isValid = await bcrypt.compare(input.password, passUser);
        if (!isValid) {
            return utils.handlerResponse(res, "BAD_REQUEST", {
                message: "Invalid Password!",
            });
        }

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Login Success!",
            data: {
                token: utils.createToken({ _id: existUser._id, ...rest }),
            },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register, login };
```

buat router HTTP Method `POST` dengan path `auth/login` di file `routers.js`

```js
//routers.js
import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
const router = Router();

//auth
router.post("/auth/register", authValidation.register, authController.register);
router.post("/auth/login", authValidation.login, authController.login);

export default router;
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint auth login"
```

mengupload ke repository github

```console
git push origin 5.endpoint/auth-login
```
