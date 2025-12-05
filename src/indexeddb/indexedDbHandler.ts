import {
    ObjectStores,
    IDBStatus,
    type IDBRecord,
    type DBStatusEvent,
    type DBReadiness,
} from "../types/db";

/* Provides agnostic CRUDs to IndexedDB. */
export class IndexedDbHandler {
    /** @ts-expect-error: TODO: dbHandler is technically undefined until the IDB open request is resolved. */
    dbHandler: IDBDatabase;
    IDBIdentifier: string;
    objectStores: typeof ObjectStores;
    status: IDBStatus = IDBStatus.Transacting;

    constructor() {
        this.IDBIdentifier = "OSDUAdminDatabase";
        this.objectStores = ObjectStores;
    }

    private isReady(): DBReadiness {
        if (!this.dbHandler) {
            return {
                ready: false,
                message: "DBHandler is not initialised.",
            };
        } else if (this.status === IDBStatus.Upgrading) {
            return {
                ready: false,
                message: "Database is currently upgrading.",
            };
        }

        return {
            ready: true,
        };
    }

    createCustomEvent(
        status: IDBStatus,
        rest?: Record<string, unknown>
    ): CustomEvent<DBStatusEvent> {
        return new CustomEvent<DBStatusEvent>("dbstatus", {
            detail: { status, ...(rest ?? undefined) },
        });
    }

    async upsert<T>(data: IDBRecord<T>, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const writeRequest = this.dbHandler
                .transaction(destination, "readwrite")
                .objectStore(destination)
                .put(data.value, data.identifier);

            writeRequest.onsuccess = () => {
                resolve(`The record ${data.identifier} was upserted.`);
            };

            writeRequest.onerror = () => {
                reject(`An error occured while writing ${data.identifier}`);
            };
        });
    }

    async delete(identifier: string, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const writeRequest = this.dbHandler
                .transaction(destination, "readwrite")
                .objectStore(destination)
                .delete(identifier);

            writeRequest.onsuccess = () => {
                resolve(`The record ${identifier} was deleted.`);
            };

            writeRequest.onerror = () => {
                reject(`An error occured while deleting ${identifier}`);
            };
        });
    }

    async read<T>(identifier: string, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const readRequest = this.dbHandler
                .transaction(destination, "readwrite")
                .objectStore(destination)
                .get(identifier);

            readRequest.onsuccess = () => {
                resolve(readRequest.result as T);
            };

            readRequest.onerror = () => {
                reject(readRequest.error);
            };
        });
    }

    async readAll<T>(destination: ObjectStores): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const readRequest = this.dbHandler
                .transaction(destination, "readonly")
                .objectStore(destination)
                .getAll();

            readRequest.onsuccess = () => {
                resolve(readRequest.result);
            };

            readRequest.onerror = () => {
                reject(readRequest.error);
            };
        });
    }

    async readAllKeys(destination: ObjectStores): Promise<IDBValidKey[]> {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const readRequest = this.dbHandler
                .transaction(destination, "readonly")
                .objectStore(destination)
                .getAllKeys();

            readRequest.onsuccess = () => {
                resolve(readRequest.result);
            };

            readRequest.onerror = () => {
                reject(readRequest.error);
            };
        });
    }

    async deleteAll(destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            const status: DBReadiness = this.isReady();

            if (status.ready === false) {
                reject(status.message);
            }

            const transaction = this.dbHandler.transaction(
                destination,
                "readwrite"
            );
            const objectStore = transaction.objectStore(destination);
            const clearRequest = objectStore.clear();

            clearRequest.onsuccess = () => {
                resolve(true);
            };

            clearRequest.onerror = (error) => {
                reject(
                    `Could not clear the object store ${destination} ${error}`
                );
            };
        });
    }

    /* Handles the process of async opening the databases and returns a this reference to this instance.. */
    public async openDB(): Promise<this> {
        return new Promise((resolve, reject) => {
            globalThis.dispatchEvent(
                new CustomEvent<IDBStatus>(IDBStatus.Init)
            );

            const openRequest = globalThis.indexedDB.open(
                this.IDBIdentifier,
                10
            );

            openRequest.onsuccess = () => {
                this.status = IDBStatus.Ready;
                globalThis.dispatchEvent(
                    this.createCustomEvent(IDBStatus.Ready)
                );
                this.dbHandler = openRequest.result;
                resolve(this);
            };

            openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                console.info(
                    `Database is being upgraded to ${event.newVersion}`
                );
                this.status = IDBStatus.Upgrading;
                globalThis.dispatchEvent(
                    this.createCustomEvent(IDBStatus.Upgrading)
                );

                const existingObjectStores =
                    openRequest.transaction?.objectStoreNames;

                // We already have some object stores created. Ensure all is created.
                //TODO: this can be done better.
                if (existingObjectStores && existingObjectStores.length > 0) {
                    if (
                        !existingObjectStores.contains(
                            this.objectStores.OSDUSchemaStore
                        )
                    ) {
                        openRequest.result.createObjectStore(
                            this.objectStores.OSDUSchemaStore
                        );
                    }

                    if (
                        !existingObjectStores.contains(
                            this.objectStores.OSDURecordStore
                        )
                    ) {
                        openRequest.result.createObjectStore(
                            this.objectStores.OSDURecordStore
                        );
                    }

                    if (
                        !existingObjectStores.contains(
                            this.objectStores.OSDUUnsavedRecordsStore
                        )
                    ) {
                        openRequest.result.createObjectStore(
                            this.objectStores.OSDUUnsavedRecordsStore
                        );
                    }
                    // We have no object stores created. Create them all.
                } else {
                    openRequest.result.createObjectStore(
                        this.objectStores.OSDUSchemaStore
                    );
                    openRequest.result.createObjectStore(
                        this.objectStores.OSDURecordStore
                    );
                    openRequest.result.createObjectStore(
                        this.objectStores.OSDUUnsavedRecordsStore
                    );
                }

                this.dbHandler = openRequest.result;
                this.status = IDBStatus.Ready;
                globalThis.dispatchEvent(
                    this.createCustomEvent(IDBStatus.Ready)
                );
                resolve(this);
            };

            openRequest.onerror = () => {
                this.status = IDBStatus.Error;
                globalThis.dispatchEvent(
                    this.createCustomEvent(IDBStatus.Error)
                );
                reject(openRequest.error);
            };
        });
    }
}
