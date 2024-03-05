# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog By Id

membuat branch 13.endpoint/bookmark-create dan pindah ke branch :

```console
git checkout -b 13.endpoint/bookmark-create
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

membuat file `bookmarkController.js` di folder controllers dan membuat module `create`

```js
//bookmarkController.js
import blogSchema from "../schemas/blogSchema.js";
import bookmarkSchema from "../schemas/bookmarkSchema.js";
import utils from "../utils/index.js";

const create = async (req, res) => {
    try {
        const { blog_id } = req.body;
        //access userId from authData
        const userId = req.authData._id;
        //find exits bookmark
        const existBookmark = await bookmarkSchema.findOne({
            user_id: userId,
            blog_id,
        });
        //if exist bookmark
        if (existBookmark) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Already Bookmark!",
            });
        }
        //find blog
        const blog = await blogSchema.findById(blog_id);
        //id author and userid same
        if (blog?.author_id?.toString() === userId) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Author Not Allow Bookmark!",
            });
        }
        //insert in database
        await bookmarkSchema.create({
            user_id: userId,
            blog_id,
        });
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Create Bookmark Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create };
```

buat router HTTP Method `POST` dengan path `/bookmark/create` di file `routers.js`

```js
//routers.js
...

router.get("/blog/history/:authorId", blogController.historyByAuthorId);

//bookmark
router.post(
    "/bookmark/create",
    checkAuthMidddleware,
    bookmarkController.create
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
git commit -m "add endpoint bookmark create"
```

mengupload ke repository github

```console
git push origin 13.endpoint/bookmark-create
```
