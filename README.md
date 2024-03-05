# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 13.endpoint/bookmark-history-user-by-blog-id dan pindah ke branch :

```console
git checkout -b 13.endpoint/bookmark-history-user-by-blog-id
```

membuat `schema bookmark`
membuat file `bookmarkSchema.js` di dalam folder schemas

```js
//bookmarkSchema.js
import { Schema, model } from "mongoose";

const bookmakSchema = new Schema(
    {
        blog_id: { type: Schema.Types.ObjectId, ref: "blog", required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true }
);

export default model("bookmark", bookmakSchema);
```

membuat file `bookmarkController.js` di folder controller dan membuat module `historyByBlogId`

```js
//bookmarkController.js
import bookmarkSchema from "../schemas/bookmarkSchema";
import utils from "../utils/index.js";

const historyUserByBlogId = async (req, res) => {
    try {
        //access BlogId from endpoint parameter
        const { blogId } = req.params;
        //access authorId from authData
        const userId = req.authData;
        //find in database
        const response = await bookmarkSchema.findOne({
            blog_id: blogId,
            user_id: userId,
        });

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get History by blog id Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { historyUserByBlogId };
```

buat router HTTP Method `GET` dengan path `/bookmark/history-user/:BlogId` di file `routers.js`

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
git commit -m "add endpoint bookmark history user by blog id"
```

mengupload ke repository github

```console
git push origin 13.endpoint/bookmark-history-user-by-blog-id
```
