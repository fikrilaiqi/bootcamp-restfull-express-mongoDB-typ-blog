# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Bookmark History User By Blog Id

membuat branch 14.endpoint/bookmark-history-user-by-blog-id dan pindah ke branch :

```console
git checkout -b 14.endpoint/bookmark-history-user-by-blog-id
```

membuat module `historyUserByBlogId` di file `bookmarkController.js`

```js
//bookmarkController.js
const historyUserByBlogId = async (req, res) => {
    try {
        //take BlogId from endpoint parameter
        const { blogId } = req.params;
        //take authorId from authData
        const userId = req.authData;
        //find in database
        const response = await bookmarkSchema.findOne({
            blog_id: blogId,
            user_id: userId,
        });

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get History user by blog id Success!",
            data: { count: response ? 1 : 0 },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create, historyUserByBlogId };
```

buat router HTTP Method `GET` dengan path `/bookmark/history-user/:blogId` di file `routers.js`

```js
//routers.js
...

//bookmark
router.post(
    "/bookmark/create",
    checkAuthMidddleware,
    bookmarkController.create
);
router.get(
    "/bookmark/history-user/:blogId",
    checkAuthMidddleware,
    bookmarkController.historyUserByBlogId
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
git commit -m "add endpoint bookmark history user by blog id"
```

mengupload ke repository github

```console
git push origin 14.endpoint/bookmark-history-user-by-blog-id
```
