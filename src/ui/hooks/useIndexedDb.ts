import {useEffect, useState } from "react";
import {osduAdminDb} from "../../indexeddb/osduAdminDb.ts";
import type {OSDURecord, OSDUSchema} from "../../types/osdu.ts";

/*
 * Provides a reference to a single OSDU record from IndexedDB.
 */
export function useRecord(identifier: string) {
  const [osduRecord, setRecord] = useState<OSDURecord>();

  useEffect(() => {
    osduAdminDb.readRecord(identifier).then((records) => setRecord(records));
  }, [identifier]);

  return osduRecord;
}

export function useSchema(kind: string) {
  const [schema, setSchema] = useState<OSDUSchema>();

  useEffect(() => {
    osduAdminDb.readSchema(kind).then((schema) => setSchema(schema));
  }, [kind]);

  return schema;
}
