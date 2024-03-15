import { DataSource } from "typeorm";

const truncateTables = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.clear();
  }
};

export { truncateTables };
