import {useEffect, useState} from "react";
import {useIndexedDb} from "./useIndexedDb.ts";
import {useEffectAsync} from "./useEffectAsync.ts";
import {ObjectStores} from "../../indexeddb/indexedDbHandler.ts";
import type {OSDURecord} from "../../types/osdu.ts";

/* Performs a IndexedDB lookup for schemas and returns a list of record identifiers. */
export function useIdentifiers() {
    const [identifiers, setIdentifiers] = useState<string[]>([]);
    const { data, getItems, dbInstance, loading } = useIndexedDb<OSDURecord>();

    useEffectAsync( async () => {
        //TODO: This should be handled in useIndexedDb ideally.
        if (dbInstance) {
            await getItems(ObjectStores.OSDURecordStore);
        }
    }, [loading])
    
    useEffectAsync( async () => {
        if (dbInstance) {
            await getItems(ObjectStores.OSDURecordStore);
        }
    }, [dbInstance]);

    useEffect(() => {
        if (!data) return;
        setIdentifiers(data?.map((record) => record.id))
    }, [data])
    
    return identifiers;
}