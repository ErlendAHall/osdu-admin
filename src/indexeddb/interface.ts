import { IndexedDbHandler } from "./indexedDbHandler.ts";
import type {OSDURecord, OSDUSchema} from "../types/osdu.ts";

export interface IOsduAdminDb {
  writeSchema: (data: OSDUSchema) => Promise<boolean>;
  writeRecord: (data: OSDURecord) => Promise<boolean>;
  readSchema: (identifier: string) => Promise<OSDUSchema>;
  readRecord: (identifier: string) => Promise<OSDURecord>;
}

class OsduAdminDb extends IndexedDbHandler implements OsduAdminDb {
  public async readRecord(identifier: string): Promise<OSDURecord> {
    return await this.read<OSDURecord>(identifier, 
        this.objectStores.OSDURecordStore) as OSDURecord;
  }

  public async readSchema(kind: string): Promise<OSDUSchema> {
    return await this.read<OSDUSchema>(kind, 
        this.objectStores.OSDUSchemaStore) as OSDUSchema;
  }

  public async writeRecord(record: OSDURecord): Promise<boolean> {
    try {
      await this.upsert<OSDURecord>({identifier: record.id, value: record}, 
          this.objectStores.OSDURecordStore);
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }

  public async writeSchema(data: OSDUSchema): Promise<boolean> {
    debugger;
    try {
      await this.upsert<OSDURecord>({identifier: data.kind ?? data["x-osdu-schema-source"], value: data}, 
          this.objectStores.OSDUSchemaStore);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }
}

const osduAdminDb = new OsduAdminDb()


export { osduAdminDb }
