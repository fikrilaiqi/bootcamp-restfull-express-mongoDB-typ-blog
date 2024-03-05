# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 11.endpoint/blog-delete-by-id dan pindah ke branch :

```console
git checkout -b 11.endpoint/blog-delete-by-id
```

membuat module `deleteById` di file `blogController.js`

```js
//blogController.js
...
const deleteById = async (req, res) => {
    try {
        //put id from endpoint parameter
        const { id } = req.params;
        const existBlog = await blogSchema.findById(id);
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }
        //remove file thumbnail in upload folder
        utils.processUploadFile(false, existBlog?.thumbnail);
        //delete in database
        await blogSchema.deleteOne({ _id: id });
        return utils.handlerResponse(res, "OK", {
            message: "Delete Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll, create, getById, editById, deleteById };
```

buat router HTTP Method `DELETE` dengan path `/blog/delete/:id` di file `routers.js`

```js
//routers.js
...

router.patch(
    "/blog/edit/:id",
    checkAuthMidddleware,
    blogValidation.editById,
    blogController.editById
);

router.delete(
    "/blog/delete/:id",
    checkAuthMidddleware,
    blogController.deleteById
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
git commit -m "add endpoint blog delete by id"
```

mengupload ke repository github

```console
git push origin 11.endpoint/blog-delete-by-id
```
