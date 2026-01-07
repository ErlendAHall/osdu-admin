import { ObjectStores } from "../../types/db.ts";
import type { UnsavedOSDURecord } from "../../types/osdu.ts";
import { useIndexedDb } from "./useIndexedDb.ts";
import merge from "lodash.merge";
import { useEffectAsync } from "./useEffectAsync.ts";

export function useUnsavedRecord(identifier: string) {
    const {
        data: masterData,
        loading,
        writeItem,
    } = useIndexedDb<UnsavedOSDURecord>();
    const record = masterData?.at(0);

    useEffectAsync(async () => {
        if (!record) {
            await saveNewChanges({ id: undefined });
        }
    }, [masterData]);

    async function saveNewChanges(partial: UnsavedOSDURecord) {
        if (partial) {
            if (!partial.id) partial.id = identifier;

            // Merge changes.
            const newRecord = merge(record ?? {}, partial);
            await writeItem(newRecord, ObjectStores.OSDUUnsavedRecordsStore);
        }
    }

    return { data: masterData, loading, saveNewChanges };
}
