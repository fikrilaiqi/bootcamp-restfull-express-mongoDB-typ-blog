# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 9.endpoint/get-blog-by-id dan pindah ke branch :

```console
git checkout -b 9.endpoint/get-blog-by-id
```

membuat module `getById` di file `blogController.js`

```js
//blogController.js
...
const getById = async (req, res) => {
    try {
        //take id from endpoint parameter
        const { id } = req.params;
        //check exit blog and populate author_id
        const existBlog = await blogSchema
            .findOne({ _id: id })
            .populate("author_id", "username image");
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get Blog by Id Success!",
            data: existBlog.toObject(),
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll, create, getById };
```

untuk membuat path parameter yang dinamis, seperti id, cukup tambahkan `:` didepan nama parameternya

buat router HTTP Method `GET` dengan path `/blog/:id` di file `routers.js`

```js
//routers.js
...

router.post(
    "/blog/create",
    checkAuthMidddleware,
    blogValidation.create,
    blogController.create
);
router.get("/blog/:id", blogController.getById);

export default router;
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint get blog by id"
```

mengupload ke repository github

```console
git push origin 9.endpoint/get-blog-by-id
```
