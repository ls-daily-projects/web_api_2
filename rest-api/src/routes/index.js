import { Router } from "express"
import { BadRequest, InternalServerError } from "http-errors"
import { insert, findById } from "../model"

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

export default apiRouter
