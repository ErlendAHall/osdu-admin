import { useIndexedDb } from "./useIndexedDb.ts";
import type { OSDURecord } from "../../types/osdu.ts";
import { useEffectAsync } from "./useEffectAsync.ts";
import { useState } from "react";
import { ObjectStores } from "../../types/db.ts";

/*
 * Provides a reference to a single OSDU record from IndexedDB.
 */
export function useRecord(identifier?: string): {
    record?: OSDURecord;
    loading: boolean;
} {
    const { dbInstance, getItem, data } = useIndexedDb<OSDURecord>();

    // Todo: Use the loading state of useIndexedDb hook.
    const [loading, setIsLoading] = useState(() => Boolean(data));

    useEffectAsync(async () => {
        setIsLoading(true);
        if (!identifier) return;
        await getItem(identifier, ObjectStores.OSDURecordStore);
        setIsLoading(false);
    }, [identifier, dbInstance]);

    return { record: data?.at(0), loading };
}
