import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { Notes } from './data/models/Notes';
import 'mssql';

const typeOrmConfig: SqlServerConnectionOptions = {
    type: "mssql",
    host: "sql2k801.discountasp.net",
    port: 1433,
    username: "SQL2008_669663_robpool_user",
    password: "nfl2009",
    database: "SQL2008_669663_robpool",
    logging: ["query"],
    options: {
        encrypt: false,
    },
    entities: [
        Notes        
    ]
};

export { typeOrmConfig };