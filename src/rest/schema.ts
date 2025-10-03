import json from "../assets/BHARun2.0.0.json";

export function getSchemaNames() {
  return ["BHARun"];
}

export function getSchema(kind: string) {
  //  Fetch records if they exist in indexeddb
  // If they exist and are not > 2 days old
  // return
  // If they don't exist or are > 2 days old
  // await fetch
  // Overwrite indexeddb
  // return
}
