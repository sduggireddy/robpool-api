import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Notes } from './data/models/Notes';

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres10",
    database: "todo",
    synchronize: true,
    logging: false,
    entities: [
        Notes        
    ]
};

export { typeOrmConfig };