import type { RecordData } from "../types/osdu";

export function isRecordData(value: object): value is RecordData {
    return value && typeof value === "object" && Reflect.has(value, "id");
}
