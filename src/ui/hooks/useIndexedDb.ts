import { useEffect, useRef, useState } from "react";
import type { OSDURecord, OSDUSchema } from "../../types/osdu.ts";
import { ObjectStores } from "../../indexeddb/indexedDbHandler.ts";
import { OsduAdminDb } from "../../indexeddb/osduAdminDb.ts";

interface IIndexedDb<T> {
    data: T[] | undefined;
    error: Error | undefined;
    loading: boolean;

    /* A reference to the running database instance.
     * Consumers should check if the instance is not undefined, but otherwise they can assume it is read and write ready.
     */
    dbInstance?: OsduAdminDb;

    /* Retrieves a single item of type T from the provided object store identifier. */
    getItem: (
        identifier: string,
        objectStore: ObjectStores
    ) => Promise<T | undefined>;

    /* Retrieves all items of type T. */
    getItems: (objectStore: ObjectStores) => Promise<T[] | undefined>;

    /* Writes a single record of type T to the provided object store identifier. */
    writeItem: (item: T, objectStore: ObjectStores) => Promise<boolean>;

    /* Removes a single record of type T to the provided object store identifier*/
    deleteItem: (
        identifier: string,
        objectStore: ObjectStores
    ) => Promise<boolean>;
}

export function useIndexedDb<T>(): IIndexedDb<T> {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<Error>();
    const [loading, setIsLoading] = useState(false);
    const dbInstance = useRef<OsduAdminDb>(undefined);

    // Mount the instance of the OsduAdminDb as a reference.
    useEffect(() => {
        async function handle(): Promise<OsduAdminDb> {
            setIsLoading(true);
            const t = new OsduAdminDb();
            return await t.openDB();
        }

        handle().then((res) => {
            if (!dbInstance.current) {
                dbInstance.current = res;
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        globalThis.addEventListener("dbupdating", () => {
            setIsLoading(true);
        });
    }, []);

    useEffect(() => {
        globalThis.addEventListener("dbupdated", () => {
            setIsLoading(false);
        });
    }, []);

    return {
        data,
        error,
        loading,
        dbInstance: dbInstance.current,
        getItem: async (identifier: string, objectStore: ObjectStores) => {
            if (!dbInstance) {
                throw new TypeError(
                    "Could not resolve the database. " +
                        "It might be in process of being instantiated."
                );
            }

            setIsLoading(true);
            let tempData: T | undefined;

            if (objectStore === ObjectStores.OSDURecordStore) {
                tempData = (await dbInstance.current?.readRecord(
                    identifier
                )) as T;
                setData([tempData]);
                setIsLoading(false);
            } else if (objectStore === ObjectStores.OSDUSchemaStore) {
                tempData = (await dbInstance.current?.readSchema(
                    identifier
                )) as T;
                setData([tempData]);
                setIsLoading(false);
            } else {
                setError(
                    new TypeError(
                        "Unable to resolve the object store named " +
                            objectStore
                    )
                );
                setIsLoading(false);
            }

            return tempData;
        },
        getItems: async (objectStore: ObjectStores) => {
            if (!dbInstance.current) {
                throw new TypeError(
                    "Could not resolve the database. " +
                        "It might be in process of being instantiated."
                );
            }
            setIsLoading(true);
            let tempData;
            if (objectStore === ObjectStores.OSDURecordStore) {
                tempData = (await dbInstance.current.readAllRecords()) as T[];
                setData(tempData);
            }
            setIsLoading(false);
            return tempData;
        },
        writeItem: async (item: T, objectStore: ObjectStores) => {
            if (!dbInstance) {
                throw new TypeError(
                    "Could not resolve the database. " +
                        "It might be in process of being instantiated."
                );
            }

            setIsLoading(true);
            let writeStatus = false;

            if (objectStore === ObjectStores.OSDURecordStore) {
                writeStatus =
                    (await dbInstance.current?.writeRecord(
                        item as OSDURecord
                    )) ?? false;
            } else if (objectStore === ObjectStores.OSDUSchemaStore) {
                writeStatus =
                    (await dbInstance.current?.writeSchema(
                        item as OSDUSchema
                    )) ?? false;
            } else if (objectStore === ObjectStores.OSDUUnsavedRecordsStore) {
                writeStatus =
                    (await dbInstance.current?.writeSchema(
                        item as OSDUSchema
                    )) ?? false;
            }

            setIsLoading(false);
            return writeStatus;
        },
        deleteItem: function (identifier: string): Promise<boolean> {
            if (!dbInstance) {
                throw new TypeError(
                    "Could not resolve the database. It might be in process of being instaniated."
                );
            }
            throw new Error("Function not implemented." + identifier);
        },
    };
}
