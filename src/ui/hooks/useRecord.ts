import { useIndexedDb } from "./useIndexedDb.ts";
import type { OSDURecord, RecordData } from "../../types/osdu.ts";
import { useEffectAsync } from "./useEffectAsync.ts";
import { useState } from "react";
import { ObjectStores } from "../../types/db.ts";

/*
 * Provides a reference to a single OSDU record from IndexedDB.
 */
export function useRecord(identifier?: string): {
    record?: OSDURecord;
    loading: boolean;
    updateRecord: (recordChanges: Partial<OSDURecord>) => void;
} {
    const {
        dbInstance,
        getItem,
        data: record,
        writeItem,
    } = useIndexedDb<OSDURecord>();

    // Todo: Use the loading state of useIndexedDb hook.
    const [loading, setIsLoading] = useState(() => Boolean(record));

    function updateRecord(recordChanges: Partial<OSDURecord>) {
        // TODO: Duck type newRecord before db update.
        const newData = {
            ...record?.at(0)?.data,
            ...recordChanges,
        } as RecordData;
        const recordToBeSaved = structuredClone(record?.at(0));

        if (recordToBeSaved) {
            recordToBeSaved.data = newData;
            writeItem(recordToBeSaved, ObjectStores.OSDUUnsavedRecordsStore);
        }
    }

    useEffectAsync(async () => {
        setIsLoading(true);
        if (!identifier) return;
        await getItem(identifier, ObjectStores.OSDURecordStore);
        setIsLoading(false);
    }, [identifier, dbInstance]);

    return { record: record?.at(0), loading, updateRecord };
}
