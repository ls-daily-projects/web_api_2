export const up = knex =>
    knex.schema.createTable("comments", comments => {
        comments.increments()
        comments.string("text").notNullable()
        comments
            .integer("post_id")
            .notNullable()
            .unsigned()
            .references("id")
            .inTable("posts")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        comments.timestamps(true, true)
    })

export const down = knex => knex.schema.dropTableIfExists("comments")
