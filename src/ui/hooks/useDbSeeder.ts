/* Mock schemas */
import bhaRunSchema from "../../assets/mockSchemas/BHARun--2.0.0.json";
import holeSectionSchema from "../../assets/mockSchemas/HoleSection--1.4.0.json";
import tubularAssemblySchema from "../../assets/mockSchemas/TubularAssembly--2.0.0.json";
import well1_0_0Schema1 from "../../assets/mockSchemas/Well--1.0.0.json";
import well1_4_0Schema from "../../assets/mockSchemas/Well--1.4.0.json";

/* Mock records */
import bhaRun1 from "../../assets/mockRecords/BHARun--2.0.0--a828c845-101a-5ca0-a729-84fe19cf8841.json";
import bhaRun2 from "../../assets/mockRecords/BHARun--2.0.0--1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed.json";
import bhaRun3 from "../../assets/mockRecords/BHARun--2.0.0--6ba7b810-9dad-11d1-80b4-00c04fd430c8.json";

import holeSection1 from "../../assets/mockRecords/HoleSection--1.4.0--9616795e-1fc1-50a2-b40f-e509668b514f.json";
import holeSection2 from "../../assets/mockRecords/HoleSection--1.4.0--7f24cc1c-5a82-4c7a-98a4-2d1e1c84b3a2.json";

import tubularAssembly1 from "../../assets/mockRecords/TubularAssembly--2.0.0--6494d378-e4df-5ca2-a913-a061a085aada.json";
import tubularAssembly2 from "../../assets/mockRecords/TubularAssembly--2.0.0--e91a3b8f-22d5-4e0d-95fc-123456789abc.json";

import well1 from "../../assets/mockRecords/Well--1.0.0--4d2e6f12-9c44-41b8-bbff-8a3b14c7d5e1.json";
import well2 from "../../assets/mockRecords/Well--1.0.0--6c60ceb0-3521-57b7-9bd8-e1d7c9f66230.json";
import well3 from "../../assets/mockRecords/Well--1.4.0--2a8bcf33-1d7e-4f2a-9e0b-87f65d43e21c.json";
import well4 from "../../assets/mockRecords/Well--1.4.0--c0ffeeb0-1dea-5e1a-8b0b-deadbeef1234.json";

import { useIndexedDb } from "./useIndexedDb.ts";
import { useEffect, useState } from "react";

export function useDbSeeder() {
    const { dbInstance } = useIndexedDb();
    const [seedingDone, setSeedingDone] = useState(false);
    useEffect(() => {
        async function handleSeeding() {
            await dbInstance?.clearRecords();
            return await Promise.allSettled([
                // @ts-expect-error mock code
                dbInstance.writeSchema(bhaRunSchema),
                // @ts-expect-error mock code
                dbInstance.writeSchema(holeSectionSchema),
                // @ts-expect-error mock code
                dbInstance.writeSchema(tubularAssemblySchema),
                // @ts-expect-error mock code
                dbInstance.writeSchema(well1_0_0Schema1),
                // @ts-expect-error mock code
                dbInstance.writeSchema(well1_4_0Schema),
                // @ts-expect-error mock code
                dbInstance.writeRecord(bhaRun1),
                // @ts-expect-error mock code
                dbInstance.writeRecord(holeSection1),
                // @ts-expect-error mock code
                dbInstance.writeRecord(tubularAssembly1),
                // @ts-expect-error mock code
                dbInstance.writeRecord(bhaRun2),
                // @ts-expect-error mock code
                dbInstance.writeRecord(bhaRun3),
                // @ts-expect-error mock code
                dbInstance.writeRecord(holeSection1),
                // @ts-expect-error mock code
                dbInstance.writeRecord(holeSection2),
                // @ts-expect-error mock code
                dbInstance.writeRecord(well1),
                // @ts-expect-error mock code
                dbInstance.writeRecord(well2),
                // @ts-expect-error mock code
                dbInstance.writeRecord(well3),
                // @ts-expect-error mock code
                dbInstance.writeRecord(well4),
                // @ts-expect-error mock code
                dbInstance.writeRecord(tubularAssembly2),
                
            ]);
        }
        if (dbInstance?.status === "ready" && !seedingDone) {
            handleSeeding().then(() => {
                setSeedingDone(true);
                console.info("Seeding is done.");
            });
        }
    }, [dbInstance, seedingDone]);

    return seedingDone;
}
