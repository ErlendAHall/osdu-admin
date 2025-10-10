export type IDBRecord<T> = {
    identifier: string;
    value: T;
};

export enum ObjectStores {
    OSDURecordStore = "OSDURecordStore",
    OSDUSchemaStore = "OSDUSchemaStore",
}

/* Provides agnostic CRUDs to IndexedDB. */
export class IndexedDbHandler {
    dbHandler: IDBDatabase | undefined;
    IDBIdentifier: string;
    objectStores: typeof ObjectStores;
    status: "ready" | "initializing" | "error" | "transacting" = "initializing";

    constructor() {
        this.IDBIdentifier = "OSDUAdminStore";
        this.objectStores = ObjectStores;
    }

    async upsert<T>(data: IDBRecord<T>, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised");
            }
            console.group("Writing new record");
            console.info("Where:", destination);
            console.info("What:", data);
            console.groupEnd();
            
            globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdating"));
            
            const writeRequest = this.dbHandler
                .transaction(destination, "readwrite")
                .objectStore(destination)
                .put(data.value, data.identifier);

            
            writeRequest.onsuccess = () => {
                globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdated", {detail: writeRequest}));
                resolve(`The record ${data.identifier} was upserted.`);
            };

            writeRequest.onerror = () => {
                reject(`An error occured while writing ${data.identifier}`);
            };
        });
    }

    async delete(identifier: string, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised");
            }
            
            

            const writeRequest = this.dbHandler
                .transaction(destination, "readwrite")
                .objectStore(destination)
                .delete(identifier);

            globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdating", {detail: writeRequest}));

            writeRequest.onsuccess = () => {
                globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdated", {detail: writeRequest}));
                resolve(`The record ${identifier} was deleted.`);
            };

            writeRequest.onerror = () => {
                reject(`An error occured while deleting ${identifier}`);
            };
        });
    }

    async read<T>(identifier: string, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised.");
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
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised.");
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
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised.");
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
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised.");
            }
            
            const transaction = this.dbHandler.transaction(destination, "readwrite");
            const objectStore = transaction.objectStore(destination);
            const clearRequest = objectStore.clear();
            
            globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdating", {detail: clearRequest}));
            
            clearRequest.onsuccess = () => {
                globalThis.dispatchEvent(new CustomEvent<IDBRequest>("dbupdated", {detail: clearRequest}));
                resolve(true);
            }
            
            clearRequest.onerror = (error) => {
                reject(`Could not clear the object store ${destination} ${error}`)
            }
        })
    }

    /* Handles the process of async opening the databases and returns a this reference to this instance.. */
    public async openDB(): Promise<this> {
        return new Promise((resolve, reject) => {
            const openRequest = globalThis.indexedDB.open(
                this.IDBIdentifier,
                1
            );

            openRequest.onsuccess = () => {
                this.status = "ready";
                this.dbHandler = openRequest.result;
                resolve(this);
            };

            openRequest.onupgradeneeded = () => {
                openRequest.result.createObjectStore(
                    this.objectStores.OSDUSchemaStore
                );
                openRequest.result.createObjectStore(
                    this.objectStores.OSDURecordStore
                );
                this.dbHandler = openRequest.result;
                this.status = "ready";
                resolve(this);
            };

            openRequest.onerror = () => {
                this.status = "error";
                reject(openRequest.error);
            };
        });
    }
}
