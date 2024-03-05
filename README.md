# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 17.endpoint/user-by-id dan pindah ke branch :

```console
git checkout -b 17.endpoint/user-by-id
```

membuat file `userController.js` di folder controller dan membuat module profile

```js
//userController.js
import userSchema from "../schemas/userSchema";
import utils from "../utils";

const profile = async (req, res) => {
    try {
        //access userId from endpoint parameter
        const { userId } = req.params;
        //find one by userId and hide password
        const response = await userSchema.findOne({ _id: userId }, "-password");
        return utils.handlerResponse(res, "OK", {
            message: "Get user by id Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { profile };
```

buat router HTTP Method `GET` dengan path `/user/:userId` di file `routers.js`

```js
//routers.js
...

router.delete(
    "/bookmark/delete/:blogId",
    checkAuthMidddleware,
    bookmarkController.deleteByBlogId
);

//user
router.get("/user/:userId", userController.profile);

export default router;

```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint user by user id"
```

mengupload ke repository github

```console
git push origin 17.endpoint/user-by-id
```
