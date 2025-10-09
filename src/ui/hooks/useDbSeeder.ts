/* Mock schemas */
import bhaRunSchema from "../../assets/mockSchemas/BHARun:2.0.0.json";
import holeSectionSchema from "../../assets/mockSchemas/HoleSection:1.4.0.json";
import tubularAssemblySchema from "../../assets/mockSchemas/TubularAssembly:2.0.0.json";

/* Mock records */
import bhaRunRecord from "../../assets/mockRecords/BHARun:2.0.0:a828c845-101a-5ca0-a729-84fe19cf8841.json";
import holeSectionRecord from "../../assets/mockRecords/HoleSection:1.4.0:9616795e-1fc1-50a2-b40f-e509668b514f.json";
import tubularAssemblyRecord from "../../assets/mockRecords/TubularAssembly:2.0.0:6494d378-e4df-5ca2-a913-a061a085aada.json";

import { useIndexedDb } from "./useIndexedDb.ts";
import { useEffect } from "react";

export function useDbSeeder() {
    const { dbInstance } = useIndexedDb();

    useEffect(() => {
        async function handleSeeding() {
            return await Promise.allSettled([
                // @ts-expect-error mock code
                dbInstance.writeSchema(bhaRunSchema),
                // @ts-expect-error mock code
                dbInstance.writeSchema(holeSectionSchema),
                // @ts-expect-error mock code
                dbInstance.writeSchema(tubularAssemblySchema),
                // @ts-expect-error mock code
                dbInstance.writeRecord(bhaRunRecord),
                // @ts-expect-error mock code
                dbInstance.writeRecord(holeSectionRecord),
                // @ts-expect-error mock code
                dbInstance.writeRecord(tubularAssemblyRecord),
            ]);
        }
        if (dbInstance?.status === "ready") {
            handleSeeding().then(() => console.info("Seeding is done."));
        }
    }, [dbInstance]);
}
