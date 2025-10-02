export type IDBRecord<T> = {
    identifier: string;
    value: T
}

enum ObjectStores {
    OSDURecordStore = "OSDURecordStore",
    OSDUSchemaStore = "OSDUSchemaStore"
}

export class IndexedDbHandler {
    dbHandler: IDBDatabase | undefined;
    IDBIdentifier: string;
    objectStores: typeof ObjectStores;

    constructor() {
        this.IDBIdentifier = "OSDUAdminStore";
        this.objectStores = ObjectStores;
        
        this.openDB()
            .then((result) => this.dbHandler = result)
            .catch((error) => {throw error});
    }

    async upsert<T>(data: IDBRecord<T>, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            debugger;
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised");
            }
            
            console.log(this.dbHandler.objectStoreNames);

            const writeRequest = this.dbHandler.transaction(destination, "readwrite")
                .objectStore(destination)
                .put(data.value, data.identifier);

            writeRequest.onsuccess = () => {
                resolve(`The record ${data.identifier} was updated.`)
            }

            writeRequest.onerror = () => {
                reject(`An error occured while writing ${data.identifier}`)
            }

        })
    }

    async delete(identifier: string, destination: ObjectStores) {
        return new Promise((resolve, reject) => {
            if (!this.dbHandler) {
                return reject("DBHandler is not initialised");
            }

            const writeRequest = this.dbHandler.transaction(destination, "readwrite")
                .objectStore(destination)
                .delete(identifier);

            writeRequest.onsuccess = () => {
                resolve(`The record ${identifier} was deleted.`)
            }

            writeRequest.onerror = () => {
                reject(`An error occured while deleting ${identifier}`)
            }
        })
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
            }
            
            readRequest.onerror = () => {
                reject(readRequest.error);
            }
        })
    }

    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            let openRequest = globalThis.indexedDB.open(this.IDBIdentifier, 1);

            openRequest.onsuccess = (event: Event) => {
                console.group("IndexedDB");
                console.info(`IndexedDB ${this.IDBIdentifier} opened`);
                console.info(event);
                console.groupEnd();
                resolve(openRequest.result);
            }
            
            openRequest.onupgradeneeded = () => {
                openRequest.result.createObjectStore(this.objectStores.OSDUSchemaStore);
                openRequest.result.createObjectStore(this.objectStores.OSDURecordStore);
                resolve(openRequest.result);
            }

            openRequest.onerror = () => {
                reject(openRequest.error);
            }

        })
    }
}
    
// @ts-ignore
window.adminDb = IndexedDbHandler;

    