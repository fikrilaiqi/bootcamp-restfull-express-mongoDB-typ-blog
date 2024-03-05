# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 16.endpoint/bookmark/delete-by-blog-id dan pindah ke branch :

```console
git checkout -b 16.endpoint/bookmark/delete-by-blog-id
```

membuat module `deleteByBlogId` di file `bookmarkController.js`

```js
//bookmarkController.js
const deleteByBlogId = async (req, res) => {
    try {
        //access blogId from endpoint parameter
        const { blogId } = req.params;
        //access userId from authData
        const userId = req.authData;
        //defaine filter
        const filter = {
            user_id: userId,
            blog_id: blogId,
        };
        //exits bookmark
        const existBookmark = await bookmarkSchema.findOne(filter);
        //if not found bookmark
        if (!existBookmark) {
            return utils.handlerResponse(res, `NOT_FOUND`, {
                message: "Not Found Bookmark!",
            });
        }
        //delete bookmark in database
        await bookmarkSchema.deleteOne(filter);
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Delete Bookmark by blog id Success!",
            data: getBlogs,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create, historyUserByBlogId, historyByUserId, deleteByBlogId };
```

buat router HTTP Method `DELETE` dengan path `/bookmark/delete/:blogId` di file `routers.js`

```js
//routers.js
...

//bookmark
router.get(
    "/bookmark/history-user/:blogId",
    checkAuthMidddleware,
    bookmarkController.historyUserByBlogId
);


router.get("/bookmark/history/:userId", bookmarkController.historyByUserId);

export default router;

```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint bookmark delete by blog id"
```

mengupload ke repository github

```console
git push origin 16.endpoint/bookmark/delete-by-blog-id
```
