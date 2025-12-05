/* Provides a reference to all records of a certain kind. */
import { useIndexedDb } from "./useIndexedDb.ts";
import type { OSDURecord } from "../../types/osdu.ts";
import { useState } from "react";
import { useEffectAsync } from "./useEffectAsync.ts";
import { ObjectStores } from "../../types/db.ts";

export function useRecordsByKind(kind: string) {
    const { getItems, data, dbInstance } = useIndexedDb<OSDURecord>();

    // Todo: Use the loading state of useIndexedDb hook.
    const [loading, setIsLoading] = useState(() => Boolean(data));

    useEffectAsync(async () => {
        if (!dbInstance) return;
        if (!kind || kind.length === 0) return;

        setIsLoading(true);
        // TODO: Write a function to return a set of records from IndexedDB.
        await getItems(ObjectStores.OSDURecordStore);
        setIsLoading(false);
    }, [kind, dbInstance]);

    return {
        records: data?.filter((d) => d.kind === kind) ?? [],
        loading,
    };
}
