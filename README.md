# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Blog Create

membuat branch 6.endpoint/blog-create dan pindah ke branch :

```console
git checkout -b 6.endpoint/blog-create
```

membuat file `blogValidation.js` di folder validations

```js
import Joi from "joi";
import utils from "../utils/index.js";

const create = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        content: Joi.string().required(),
        tags: Joi.string(),
        title: Joi.string().required(),
        thumbnail: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { create };
```

membuat modul `processUploadFile` di folder utils

```js
//utils/index.js
...
import fs from "fs";

const toUploadFile = (file) => {
    //initial result
    let result = { fileName: null };
    try {
        //if file upload empty
        if (!file) return { ...result, error: "Not found file upload!" };
        //access origin name
        const originName = file.name;
        //create unix timestamp
        const unixTimestamp = Math.round(Date.now());
        //combain origin name and unix timestamp
        const rename = `${unixTimestamp}-${originName}`;
        //create file from upload and rename file
        fs.writeFileSync(`./upload/${rename}`, file.data);
        return { ...result, fileName: rename };
    } catch (error) {
        //return error
        return { ...result, error: error.message };
    }
};

const processUploadFile = (file, oldFileName) => {
    //initial result
    let result = { fileName: null };
    try {
        //if oldFileName found
        if (oldFileName) {
            //remove oldfile uploaded in folder upload
            fs.unlinkSync(`./upload/${oldFileName}`);
        }
        //if file found
        if (file) {
            //procees upload file
            result = toUploadFile(file);
        }
        return result;
    } catch (error) {
        //return error
        return { ...result, error: error.message };
    }
};

export default { getEnv, handlerResponse, validationInput, createToken, processUploadFile };
```

membuat file `blogController.js` dan membuat module create

```js
//blogController.js
const create = async (req, res) => {
    try {
        const input = req.body;
        const file = req.files;

        //process upload file
        const { fileName, error: errFileUpload } = utils.processUploadFile(
            file?.thumbnail
        );
        //if error upload file
        if (errFileUpload) {
            throw Error(errFileUpload);
        }
        //access authorId from authData
        const authorId = req.authData._id;
        //create Object
        const createBlogObj = {
            ...input,
            author_id: authorId,
            thumbnail: fileName,
            tags: input?.tags ? input?.tags.split(",") : "",
        };
        //insert database
        const response = await blogSchema.create(createBlogObj);
        //return response
        return utils.handlerResponse(res, "CREATED", {
            message: "Blog created Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll, create };
```

buat router HTTP Method `POST` dengan path `/blog/create` di file `routers.js`

```js
//routers.js
...
import blogController from "./controllers/blogController.js";
const router = Router();

...
//blog
router.get("/blog/all", blogController.getAll);
router.post(
    "/blog/create",
    checkAuthMidddleware,
    blogValidation.create,
    blogController.create
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
git commit -m "add endpoint blog create"
```

mengupload ke repository github

```console
git push origin 6.endpoint/blog-create
```
