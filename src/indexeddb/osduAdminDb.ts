import { IndexedDbHandler } from "./indexedDbHandler.ts";
import type {
    OSDURecord,
    OSDUSchema,
    UnsavedOSDURecord,
    // UnsavedOSDURecord,
} from "../types/osdu.ts";
import { ObjectStores } from "../types/db.ts";

export interface IOsduAdminDb {
    writeSchema: (data: OSDUSchema) => Promise<boolean>;
    writeRecord: (data: OSDURecord) => Promise<boolean>;
    // writeRecordChanges: (data: UnsavedOSDURecord) => Promise<boolean>;
    // readRecordChanges: (identifier: string) => Promise<UnsavedOSDURecord>;
    readSchema: (identifier: string) => Promise<OSDUSchema>;
    readRecord: (identifier: string) => Promise<OSDURecord>;
}

export class OsduAdminDb extends IndexedDbHandler implements IOsduAdminDb {
    // writeRecordChanges: (data: UnsavedOSDURecord) => Promise<boolean>;
    // readRecordChanges: (identifier: string) => Promise<UnsavedOSDURecord>;
    public async readRecord(identifier: string): Promise<OSDURecord> {
        return (await this.read<OSDURecord>(
            identifier,
            this.objectStores.OSDURecordStore
        )) as OSDURecord;
    }

    public async readSchema(kind: string): Promise<OSDUSchema> {
        return (await this.read<OSDUSchema>(
            kind,
            this.objectStores.OSDUSchemaStore
        )) as OSDUSchema;
    }

    public async readAllRecords(): Promise<Array<OSDURecord>> {
        return await this.readAll<OSDURecord>(
            this.objectStores.OSDURecordStore
        );
    }

    public async readAllSchemas(): Promise<Array<OSDUSchema>> {
        return await this.readAll<OSDUSchema>(
            this.objectStores.OSDUSchemaStore
        );
    }

    public async getSchemaKeyFromRecord(
        identifier: string
    ): Promise<string | undefined> {
        const keys = await this.readAllKeys(ObjectStores.OSDUSchemaStore);

        // TODO: This will ignore any schema versions.
        // osdu:wks:master-data--HoleSection:1.4.0 -> HoleSection
        identifier = identifier.split("--")[1].split(":")[0];

        const match = keys.find((key) => String(key).includes(identifier));

        return String(match);
    }

    public async writeRecord(record: OSDURecord): Promise<boolean> {
        try {
            await this.upsert<OSDURecord>(
                { identifier: record.id, value: record },
                this.objectStores.OSDURecordStore
            );
            return true;
        } catch (e: unknown) {
            console.error(e);
            return false;
        }
    }

    public async writeSchema(data: OSDUSchema): Promise<boolean> {
        try {
            await this.upsert<OSDURecord>(
                {
                    // @ts-expect-error: TODO: type this
                    identifier: data.kind ?? data["x-osdu-schema-source"],
                    // @ts-expect-error: TODO: type this
                    value: data,
                },
                this.objectStores.OSDUSchemaStore
            );
            return true;
        } catch {
            return false;
        }
    }

    public async writeUnsavedSchema(data: OSDUSchema): Promise<boolean> {
        try {
            await this.upsert<UnsavedOSDURecord>(
                {
                    // @ts-expect-error: TODO: type this
                    identifier: data.kind ?? data["x-osdu-schema-source"],
                    // @ts-expect-error: TODO: type this
                    value: data,
                },
                this.objectStores.OSDUUnsavedRecordsStore
            );
            return true;
        } catch {
            return false;
        }
    }

    public async clearRecords(): Promise<unknown> {
        return await this.deleteAll(ObjectStores.OSDURecordStore);
    }

    public async resolveKindFromRecord(identifier: string): Promise<string> {
        const kindFromId = await this.getSchemaKeyFromRecord(identifier);
        if (!kindFromId)
            throw new Error(
                "Could not resolve a kind from the record id: " + identifier
            );
        return kindFromId;
    }
}

const osduAdminDb = new OsduAdminDb();

// @ts-expect-error test code
globalThis.osduAdminDb = osduAdminDb;

export { osduAdminDb };
