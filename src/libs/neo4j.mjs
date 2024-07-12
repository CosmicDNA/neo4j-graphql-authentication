import neo4j from 'neo4j-driver'

const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = process.env

const driver = neo4j.driver(
  // "neo4j://localhost:7687",
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
)

export default driver
