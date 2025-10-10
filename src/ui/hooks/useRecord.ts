import {useIndexedDb} from "./useIndexedDb.ts";
import type {OSDURecord} from "../../types/osdu.ts";
import {useEffectAsync} from "./useEffectAsync.ts";
import {ObjectStores} from "../../indexeddb/indexedDbHandler.ts";

/*
 * Provides a reference to a single OSDU record from IndexedDB.
 */
export function useRecord(identifier?: string): OSDURecord | undefined {
    const { dbInstance, getItem, data } = useIndexedDb<OSDURecord>();

    useEffectAsync(async() => {
        if (!identifier) return;
        await(getItem(identifier, ObjectStores.OSDURecordStore));
    }, [identifier, dbInstance]);

    return data?.at(0);
}
