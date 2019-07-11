import { Router } from "express"
import { BadRequest, InternalServerError, NotFound } from "http-errors"
import {
    insert,
    findById,
    insertComment,
    findCommentById,
    find
} from "../model"

const apiRouter = Router()

apiRouter.post("/posts", async (req, res, next) => {
    const { title, contents } = req.body

    if (!title || !contents) {
        return next(
            BadRequest("Please provide title and contents for the post.")
        )
    }

    try {
        const { id } = await insert({ title, contents })
        const newPost = await findById(id)
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError(
                "There was an error while saving the post to the database"
            )
        )
    }
})

apiRouter.post("/posts/:postId/comments", async (req, res, next) => {
    const { text } = req.body
    const { postId } = req.params

    if (!text) return next(BadRequest("Please provide text for the comment."))

    try {
        const foundPosts = await findById(postId)

        if (foundPosts.length < 1)
            return next(
                NotFound("The post with the specified ID does not exist.")
            )

        const { id } = await insertComment({ post_id: postId, text })
        const [newComment] = await findCommentById(id)
        res.status(201).json(newComment)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError(
                "There was an error while saving the comment to the database"
            )
        )
    }
})

apiRouter.get("/posts", async (_req, res, next) => {
    try {
        const posts = await find()
        res.json(posts)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError("The posts information could not be retrieved.")
        )
    }
})

export default apiRouter
