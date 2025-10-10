import {records} from "../assets/mockRecords";

export async function getEntityRecord<T>(identifier: string): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(async () => {
            // @ts-expect-error This is temporary code.
            resolve(records[identifier.split(":")[2]]);
        }, 2000);
    });
}

// @ts-expect-error This is temporary code.
globalThis.getRecord = getEntityRecord;