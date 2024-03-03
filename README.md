# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Auth Refresh Token

membuat branch 6.endpoint/auth-refresh-token dan pindah ke branch :

```console
git checkout -b 6.endpoint/auth-refresh-token
```

> untuk melindungi akses routers/endpoints yang membutuhkan authentifikasi, kita harus memeriksa request yang masuk, apakah memiliki token valid atau tidak melalui middleware dan apabila secretnya tidak sama dengan yang disimpan server maka tidak akan lolos verifikasi.

buat folder middlewares dan buat file `checkAuthMiddleware.js`

```js
//checkAuthMiddleware.js
import jwt from "jsonwebtoken";
import utils from "../utils/index.js";

export const checkAuthMidddleware = (req, res, next) => {
    try {
        //put token in request header Authorization :  "Bearer <token>"
        const authHeader = req.header("Authorization") || "";
        //put token only
        const token = authHeader && authHeader.split(" ").at(1);
        //if token empty
        if (!token) throw Error("Access Denied!");
        //veryfy token with secret
        const verified = jwt.verify(token, utils.getEnv("JWT_SECRET"));
        //if not verified
        if (!verified) throw Error("Invalid Token!");
        //save data to req.authData
        req.authData = verified;
        //next process
        next();
    } catch (error) {
        //error handler
        return utils.handlerResponse(res, "UNAUTHORIZED", {
            message: error.message || "Expired Token!",
        });
    }
};
```

> `Refresh Token` ini digunakan untuk membuat token baru, jadi setiap ada request masuk maka token akan di perbaharui.

membuat modul refreshToken di file `authController.js`

```js
//authController.js
...

const refreshToken = async (req, res) => {
    try {
        const { _id, ...rest } = req.authData;
        //find user exist and hide password
        const existUser = await usersSchema.findOne({ _id }, "-password");
        //if user not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "User Not Found!",
            });
        }
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Refresh Token Success!",
            data: {
                token: utils.createToken({
                    _id: existUser._id,
                    ...existUser.toObject(),
                }),
            },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register, login, refreshToken };
```

buat router HTTP Method `GET` dengan path `auth/refresh-token` di file `routers.js`

```js
//routers.js
...
import { checkAuthMidddleware } from "./middlewares/checkAuthMiddleware.js";
const router = Router();

...
router.post("/auth/login", authValidation.login, authController.login);
router.post(
    "/auth/refresh-token",
    checkAuthMidddleware,
    authController.refreshToken
);

export default router;
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint auth refresh token"
```

mengupload ke repository github

```console
git push origin 6.endpoint/auth-refresh-token
```
