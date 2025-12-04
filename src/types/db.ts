export type IDBRecord<T> = {
    identifier: string;
    value: T;
};

export enum ObjectStores {
    OSDURecordStore = "OSDURecordStore",
    OSDUUnsavedRecordsStore = "OSDUUnsavedRecordsStore",
    OSDUSchemaStore = "OSDUSchemaStore",
}

export enum IDBStatus {
    /** Idb is ready for transactions */
    Ready = "ready",
    /** Idb is in its 'opening' state. Not used yet and there are some overlap with 'upgrading'. */
    Init = "initializing",
    /* The IdbHandler has thrown an error. Not used or very defined yet. */
    Error = "error",
    /* The Idb is currently performing a transaction. */
    Transacting = "transacting",
    /* The Idb is currently upgrading to a newer version. */
    Upgrading = "upgrading",
}

export type DBReadiness = {
    ready: boolean;
    message?: string;
};

export type DBStatusEvent = {
    [key: string]: string;
    status: IDBStatus;
};
