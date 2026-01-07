import type { RecordData, UnsavedOSDURecord } from "../types/osdu";

/**
 * From a dotted path string and a value, returns a nested object.
 * @example
 * If path is "foo.bar" and value is "baz", the resulting object is
 * {
 * foo: {
 *   bar: "baz"
 *  }
 * }
 */
export function createNestedOSDURecord(
    obj: UnsavedOSDURecord,
    path: string,
    value: string | number
): UnsavedOSDURecord {
    const keys = path.split(".");
    const lastKey = keys.pop()!;

    // Deep clone the entire object
    const result = structuredClone(obj);

    // Navigate through the path
    let current: Record<string, string | number | RecordData> = result;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // Create nested object if it doesn't exist
        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
        }
        current = current[key] as RecordData;
    }

    current[lastKey] = value;
    return result;
}
