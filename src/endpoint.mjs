import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Neo4jGraphQL } from '@neo4j/graphql'
import pkg from '@neo4j/graphql-ogm'
import { join } from 'path'
import { readFileSync } from 'fs'
import driver from './libs/neo4j.mjs'
import getFileProperties from './libs/file-properties.mjs'

const { OGM } = pkg

const { dirName } = getFileProperties(import.meta.url)
const typeDefs = readFileSync(join(dirName, 'schema.graphql'), 'utf-8').toString()

const ogm = new OGM({ typeDefs, driver })

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  features: {
    authorization: {
      key: process.env.AUTH_SECRET
    }
  }
})

const [schema] = await Promise.all([
  neoSchema.getSchema(),
  ogm.init()
])

const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization
    return {
      token
    }
  }
})

console.log(`🚀 Server ready at ${url}`);