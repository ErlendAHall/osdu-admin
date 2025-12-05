import { useIndexedDb } from "./useIndexedDb.ts";
import type { OSDURecord } from "../../types/osdu.ts";
import { useEffectAsync } from "./useEffectAsync.ts";
import { useMemo, useState } from "react";
import { ObjectStores } from "../../types/db.ts";

/*
 * Provides a reference to a selection of OSDU records from IndexedDB.
 */
export function useRecords(identifiers?: string[]): {
    records?: OSDURecord[];
    loading: boolean;
} {
    const { getItems, data } = useIndexedDb<OSDURecord>();

    // Todo: Use the loading state of useIndexedDb hook.
    const [loading, setIsLoading] = useState(() => Boolean(data));

    const identifiersKey = useMemo(
        () =>
            identifiers && identifiers.length
                ? identifiers.slice().sort().join("|")
                : "",
        [identifiers]
    );

    useEffectAsync(async () => {
        if (!identifiers || identifiers.length === 0) return;

        setIsLoading(true);
        // TODO: Write a function to return a set of records from IndexedDB.
        await getItems(ObjectStores.OSDURecordStore);
        setIsLoading(false);
    }, [identifiersKey]);

    return {
        records: data?.filter((d) => identifiers?.includes(d.id)) ?? [],
        loading,
    };
}
