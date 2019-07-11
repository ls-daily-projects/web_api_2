export const up = knex =>
    knex.schema.createTable("posts", posts => {
        posts.increments()
        posts.string("title", 1024).notNullable()
        posts.text("contents").notNullable()
        posts.timestamps(true, true)
    })

export const down = knex => knex.schema.dropTableIfExists("posts")
