# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog All

membuat branch 6.endpoint/get-blog-all dan pindah ke branch :

```console
git checkout -b 6.endpoint/get-blog-all
```

membuat `schema blog`
membuat file `blogSchema.js` di folder schemas

```js
//schemas/blogSchema.js
import { Schema, model } from "mongoose";

const blogSchema = new Schema(
    {
        content: { type: String, required: true },
        tags: { type: [String] },
        author_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
        title: { type: String, required: true },
        thumbnail: { type: String },
    },
    { timestamps: true }
);

export default model("blog", blogSchema);
```

membuat file `blogController.js` dan membuat module getBlogAll

```js
//blogController.js
const getAll = async (req, res) => {
    try {
        //find All Blog and populate/join from ref
        const response = await blogSchema
            .find({})
            .populate("author_id", "username image");

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get blog all Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll };
```

buat router HTTP Method `GET` dengan path `/blog/all` di file `routers.js`

```js
//routers.js
...
import blogController from "./controllers/blogController.js";
const router = Router();

...
//blog
router.get("/blog/all", blogController.getAll);

export default router;
```

## Mendaftarkan history perubahan repository ke git dan upload ke github

medaftarkan semua perubahan pada repository local, ketikan perintah

```console
git add .
```

melakukan commit perubahan

```console
git commit -m "add endpoint get blog all"
```

mengupload ke repository github

```console
git push origin 6.endpoint/get-blog-all
```
