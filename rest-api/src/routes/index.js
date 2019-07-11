import { Router } from "express"
import { BadRequest, InternalServerError, NotFound } from "http-errors"
import {
    insert,
    findById,
    insertComment,
    findCommentById,
    find,
    findPostComments,
    remove,
    update
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

apiRouter.get("/posts/:postId", async (req, res, next) => {
    const { postId } = req.params

    try {
        const [post] = await findById(postId)

        if (!post)
            return next(
                NotFound("The post with the specified ID does not exist.")
            )

        res.json(post)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError("The posts information could not be retrieved.")
        )
    }
})

apiRouter.get("/posts/:postId/comments", async (req, res, next) => {
    const { postId } = req.params

    try {
        const [post] = await findById(postId)

        if (!post)
            return next(
                NotFound("The post with the specified ID does not exist.")
            )

        const comments = await findPostComments(postId)
        res.json(comments)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError("The posts information could not be retrieved.")
        )
    }
})

apiRouter.delete("/posts/:postId", async (req, res, next) => {
    const { postId } = req.params

    try {
        const [post] = await findById(postId)

        if (!post)
            return next(
                NotFound("The post with the specified ID does not exist.")
            )

        await remove(postId)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        next(
            InternalServerError("The posts information could not be retrieved.")
        )
    }
})

apiRouter.put("/posts/:postId", async (req, res, next) => {
    const { postId } = req.params
    const { title, contents } = req.body

    if (!title || !contents) {
        return next(
            BadRequest("Please provide title and contents for the post.")
        )
    }

    try {
        const [post] = await findById(postId)

        if (!post)
            return next(
                NotFound("The post with the specified ID does not exist.")
            )

        const isSuccess = await update(postId, { title, contents })

        if (!isSuccess)
            return next(InternalServerError("Couldn't update for some reason."))

        const [newPost] = await findById(postId)

        res.json(newPost)
    } catch (error) {
        console.log(error)
        next(InternalServerError("The post information could not be modified."))
    }
})

export default apiRouter
