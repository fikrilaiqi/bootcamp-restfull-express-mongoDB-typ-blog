# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Blog Edit By Id

membuat branch 10.endpoint/blog-edit-by-id dan pindah ke branch :

```console
git checkout -b 10.endpoint/blog-edit-by-id
```

membuat module validation `editById` di file `blogValidation.js`

```js
//blogValidation.js
...
const editById = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        content: Joi.string(),
        tags: Joi.string(),
        title: Joi.string(),
        old_thumbnail: Joi.string(),
        thumbnail: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { create, editById };
```

membuat module `editById` di file `blogController.js`

```js
//blogController.js
...
const editById = async (req, res) => {
    try {
        //take id from path parameter
        const { id } = req.params;
        const input = req.body;
        const file = req.files;
        //find exits blog
        const existBlog = await blogSchema.findById(id);
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }

        //if replace thumbnail , old_thumbnail filename required!
        if (existBlog.toObject().thumbnail && !input?.old_thumbnail) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Found thumbnail file , old_thumbnail is required!",
            });
        }

        //access authorId from authData
        const authorId = req.authData._id;
        //process upload file or replace file
        const { fileName, error: fileUploadError } = utils.processUploadFile(
            file?.thumbnail,
            input?.old_thumbnail
        );
        //if error upload file
        if (fileUploadError) {
            throw Error(fileUploadError);
        }
        //update object
        const updateBlogObj = {
            ...input,
            author_id: authorId,
            thumbnail: fileName,
            tags: input?.tags ? input?.tags.split(",") : "",
        };
        //update in database
        await blogSchema.findByIdAndUpdate(
            { _id: id },
            {
                $set: updateBlogObj,
            }
        );
        return utils.handlerResponse(res, "OK", {
            message: "Edit Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll, create, getById, editById };
```

buat router HTTP Method `PATCH` dengan path `/blog/edit/:id` di file `routers.js`

```js
//routers.js
...

router.get("/blog/:id", blogController.getById);
router.patch(
    "/blog/edit/:id",
    checkAuthMidddleware,
    blogValidation.editById,
    blogController.editById
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
git commit -m "add endpoint blog edit by id"
```

mengupload ke repository github

```console
git push origin 10.endpoint/blog-edit-by-id
```
