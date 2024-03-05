# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Bookmark History By Id User

membuat branch endpoint/bookmark-history-by-user-id dan pindah ke branch :

```console
git checkout -b endpoint/bookmark-history-by-user-id
```

membuat module `historyByUserId` di file `bookmarkController.js`

```js
//bookmarkController.js
const historyByUserId = async (req, res) => {
    try {
        //take userId from endpoint parameter
        const { userId } = req.params;
        //find bookmark by userId
        const response = await bookmarkSchema.find({ user_id: userId });

        //get All UserId and save in array
        const blogIds = [];
        for (let i = 0; i < response?.length; i++) {
            const { blog_id } = response[i];
            result.push(blog_id);
        }

        //find blog by blogIds and populate author_id
        const getBlogs = await blogsSchema
            .find({ _id: { $in: blogIds } })
            .populate("author_id", "username image");
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get History by user id Success!",
            data: getBlogs,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create, historyUserByBlogId, historyByUserId };
```

buat router HTTP Method `GET` dengan path `/bookmark/history-user/:blogId` di file `routers.js`

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
git commit -m "add endpoint bookmark history by user id"
```

mengupload ke repository github

```console
git push origin endpoint/bookmark-history-by-user-id
```
