import schema from "./BHARun2.0.0.json";
import record from "./BHARun2.0.0Vals.json";
import {osduAdminDb} from "../indexeddb/interface.ts";

const {osduAdminDb} = await import("../indexeddb/interface.ts");

console.log("seeding")
// @ts-ignore
globalThis.osduAdminDb = osduAdminDb;
// @ts-ignore
osduAdminDb.writeSchema(schema);
// @ts-ignore
osduAdminDb.writeRecord(record);
