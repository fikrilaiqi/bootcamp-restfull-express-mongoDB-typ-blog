# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 18.endpoint/user-edit-by-id dan pindah ke branch :

```console
git checkout -b 18.endpoint/user-edit-by-id
```

membuat file userValidation di folder validations dan membuat module editById

```js
//userValidation
import Joi from "joi";
import utils from "../utils/index.js";

const editProfile = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        fullname: Joi.string(),
        old_image: Joi.string(),
        image: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { editProfile };
```

membuat module `editProfile` di file userController

```js
//userController.js
...
const editProfile = async (req, res) => {
    try {
        //access id from endpoint parameter
        const input = req.body;
        const file = req.files;
        //access authorId from authData
        const userId = req.authData._id;

        //find exit user
        const existUser = await userSchema.findById(userId);
        //if not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }

        //if replace image , old_image filename required!
        if (existUser.toObject().image && !input?.old_image) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Found image file , old_image is required!",
            });
        }
        //process upload file or replace file
        const { fileName, error: errFileUpload } = utils.processUploadFile(
            file?.image,
            input?.old_image
        );
        //if error upload file
        if (errFileUpload) {
            throw Error(errFileUpload);
        }

        const updateUserObj = { ...input, image: fileName };
        await userSchema.findByIdAndUpdate(
            { _id: userId },
            { $set: updateUserObj }
        );
        return utils.handlerResponse(res, "OK", {
            message: "Edit User Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};
export default { profile, editProfile };
```

buat router HTTP Method `PATCH` dengan path `/user/profile/edit` di file `routers.js`

```js
//routers.js
...
//user
router.get("/user/:userId", userController.profile);
router.patch(
    "/user/profile/edit",
    checkAuthMidddleware,
    userValidation.editProfile,
    userController.editProfile
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
git commit -m "add endpoint user edit by id"
```

mengupload ke repository github

```console
git push origin 18.endpoint/user-edit-by-id
```
