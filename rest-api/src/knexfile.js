import { dbUri } from "./config"

export const development = {
    client: "sqlite3",
    connection: { filename: dbUri },
    useNullAsDefault: true,
    pool: {
        afterCreate: (connection, done) => {
            connection.run("PRAGMA foreign_keys = ON", done)
        }
    },
    migrations: {
        directory: "./data/migrations",
        tableName: "dbmigrations"
    },
    seeds: { directory: "./data/seeds" }
}
