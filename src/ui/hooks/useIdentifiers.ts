import { useEffect, useState } from "react";
import { useIndexedDb } from "./useIndexedDb.ts";
import { useEffectAsync } from "./useEffectAsync.ts";
import type { OSDURecord } from "../../types/osdu.ts";
import { ObjectStores } from "../../types/db.ts";

/* Performs a IndexedDB lookup for schemas and returns a list of record identifiers. */
export function useIdentifiers(byKind?: string) {
    const [identifiers, setIdentifiers] = useState<string[]>([]);
    const { data, getItems, dbInstance, loading } = useIndexedDb<OSDURecord>();

    useEffectAsync(async () => {
        //TODO: This should be handled in useIndexedDb ideally.
        if (dbInstance) {
            await getItems(ObjectStores.OSDURecordStore);
        }
    }, [loading, dbInstance]);

    useEffect(() => {
        if (!data) return;
        if (byKind) {
            setIdentifiers(
                data
                    .filter((record) => record.kind === byKind)
                    .map((record) => record.id)
            );
        } else {
            setIdentifiers(data.map((record) => record.id));
        }
    }, [byKind, data]);

    return identifiers;
}
