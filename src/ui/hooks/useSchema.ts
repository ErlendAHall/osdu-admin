import type {OSDUSchema} from "../../types/osdu.ts";
import {useIndexedDb} from "./useIndexedDb.ts";
import {ObjectStores} from "../../indexeddb/indexedDbHandler.ts";
import {useEffectAsync} from "./useEffectAsync.ts";

export function useSchema(kind?: string) {
    const { data, getItem } = useIndexedDb<OSDUSchema>();

    useEffectAsync(async() => {
        if (!kind) return;
        await getItem(kind, ObjectStores.OSDUSchemaStore);
    }, [kind]);

    return data?.at(0);
}
