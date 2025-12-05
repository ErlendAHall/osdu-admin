import { ObjectStores } from "../../types/db.ts";
import type { UnsavedOSDURecord } from "../../types/osdu.ts";
import { useIndexedDb } from "./useIndexedDb.ts";
import merge from "lodash.merge";

export function useUnsavedRecord(identifier: string) {
    const { data, loading, writeItem } = useIndexedDb<UnsavedOSDURecord>();

    async function saveNewChanges(partial: UnsavedOSDURecord) {
        if (partial) {
            if (!partial.id) partial.id = identifier;

            // Merge changes.
            const dataToBeSaved = merge(data, partial);
            await writeItem(
                dataToBeSaved,
                ObjectStores.OSDUUnsavedRecordsStore
            );
        }
    }

    return { data, loading, saveNewChanges };
}
