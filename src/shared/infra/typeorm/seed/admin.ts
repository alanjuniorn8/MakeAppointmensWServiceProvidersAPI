import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid"

import createConnections from "../index";

async function create() {
   const connections = await createConnections();
   const pgConnection = connections[0];
   console.log(pgConnection)

   const id = uuidV4();
   const password = await hash("admin", 8);

   await pgConnection.query(
    `INSERT INTO users(id, name, email, password, created_at, updated_at )
    VALUES('${id}', 'admin', 'admin@admin.admin', '${password}', 'now()', 'now()')
    `
   );

   pgConnection.close;
}

create().then(() => console.log("User admin created!"));