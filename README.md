# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog history By author Id

membuat branch 12.endpoint/blog-history-by-author-id dan pindah ke branch :

```console
git checkout -b 12.endpoint/blog-history-by-author-id
```

membuat module `deleteById` di file `blogController.js`

```js
//blogController.js
...
const historyByAuthorId = async (req, res) => {
    try {
        //take author id from path params
        const { authorId } = req.params;
        //find and populate author_id
        const response = await blogSchema
            .find({ author_id: authorId })
            .populate("author_id", "username image");
        //return reponse
        return utils.handlerResponse(res, "OK", {
            message: "Get Blog History By Author Id Success!",
            data: response,
        });
    } catch (error) {
        //return if error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default {
    getAll,
    create,
    getById,
    editById,
    deleteById,
    historyByAuthorId,
};
```

buat router HTTP Method `GET` dengan path `/blog/history/:authorId` di file `routers.js`

```js
//routers.js
...


router.delete(
    "/blog/delete/:id",
    checkAuthMidddleware,
    blogController.deleteById
);
router.get("/blog/history/:authorId", blogController.historyByAuthorId);

export default router;

```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint blog history by author id"
```

mengupload ke repository github

```console
git push origin 12.endpoint/blog-history-by-author-id
```
