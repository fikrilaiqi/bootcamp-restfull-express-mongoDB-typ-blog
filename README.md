# RestFull API menggunakan Express dan MongoDB

## Membuat endpoint Get Blog All

membuat branch 6.endpoint/get-blog-all dan pindah ke branch :

```console
git checkout -b 6.endpoint/get-blog-all
```

membuat `schema blogs`
membuat file `blogsSchema.js` di folder schemas

```js
//schemas/blogsSchema.js
import { Schema, model } from "mongoose";

const blogsSchema = new Schema(
    {
        content: { type: String, required: true },
        tags: { type: [String] },
        author_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
        title: { type: String, required: true },
        thumbnail: { type: String },
    },
    { timestamps: true }
);

export default model("blog", blogsSchema);
```

membuat file `blogsController.js` dan membuat module getBlogAll

```js
//blogsController.js
const getBlogAll = async (req, res) => {
    try {
        //find All Blog and populate/join from ref
        const response = await blogsSchema
            .find({})
            .populate("author_id", "username image");

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get All blog Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getBlogAll };
```

buat router HTTP Method `GET` dengan path `/blog` di file `routers.js`

```js
//routers.js
...
import blogsController from "./controllers/blogsController.js";
const router = Router();

...
//blog
router.get("/blog/all", blogsController.getBlogAll);

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
