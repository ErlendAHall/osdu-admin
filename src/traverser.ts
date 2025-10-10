import type { OSDUField } from "./types/form.ts";
import type {OSDURecord, OSDUSchema} from "./types/osdu.ts";

/* Recursively traverses a OSDU schema to find all properties renderable in a HTML form.
   When a node has all required properties, its property name (path) is stored in field.value. */
export async function collectNodesWithRequiredProps(
    root: OSDUSchema,
    record: OSDURecord
): Promise<OSDUField[]> {
    let found: OSDUField[] = [];
    const required = ["description", "title"];

    function traverse(node: unknown, path: string): void {
        if (node === null || typeof node !== "object") return;

        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                traverse(node[i], `${path}[${i}]`);
            }
            return;
        }

        const obj = node as OSDUField;

        const hasAllRequiredProps = required.every((k) =>
            Object.prototype.hasOwnProperty.call(obj, k)
        );

        if (hasAllRequiredProps) {
            obj.identifier = path.split(".").at(-1)!;
            found.push(obj);
        }

        for (const [childKey, value] of Object.entries(obj)) {
            traverse(value, path ? `${path}.${childKey}` : childKey);
        }
    }

    traverse(root, "root");
    found = await collectValues(found, record);
    return found;
}

/* Accepts a list of OSDUFields and attempts to populate their respective value properties with data. */
export async function collectValues(osduFields: OSDUField[], record: OSDURecord) {
    

    const commonProps = [
        "id",
        "kind",
        "version",
        "act",
        "legal",
        "tags",
        "createTime",
        "createUser",
        "modifyTime",
        "modifyUser",
        "ancestry",
    ];

    //TODO: write a copy to IndexedDB.
    const osduFieldsClone = structuredClone(osduFields);

    osduFieldsClone.forEach((field) => {
        const identifier = field.identifier;
        
        if (commonProps.includes(identifier)) {
            // @ts-expect-error foobar
            field.value = record[identifier];
        } else {
            // @ts-expect-error foobar
            field.value = record.data[identifier];
        }
    });

    return osduFieldsClone;
}
