import "./App.css";
import { Tabs } from "@equinor/eds-core-react";
import { useState} from "react";
import { useIdentifiers } from "./hooks/useIdentifiers.ts";
import { RecordPanel } from "./RecordPanel.tsx";
import { NewRecordPanel } from "./NewRecordPanel/NewRecordPanel.tsx";
import { useDbSeeder } from "./hooks/useDbSeeder.ts";
import { useRecord } from "./hooks/useRecord.ts";
import { useSchema } from "./hooks/useSchema.ts";
import { useRecords } from "./hooks/useRecords.ts";
import { useSchemas } from "./hooks/useSchemas.ts";

function truncateTitle(title: string) {
    const entityName = title.split("--")[1].split(":")[0];
    const truncatedVersion = title.split(":")?.at(-1)?.split("-")?.at(-1);
    return entityName + ":" + truncatedVersion;
}


// @ts-expect-error Just a testing component
function OSDUAdminTest() {
    const seedingIsDone = useDbSeeder();
    const { schema, loading: schemaLoading } = useSchema(
        "osdu:wks:master-data--TubularAssembly:2.0.0"
    );
    const { record, loading: recordLoading } = useRecord(
        "namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841"
    );
    const { records, loading: recordsLoading } = useRecords([
        "namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841",
    ]);
    const { schemas, loading: schemasLoading } = useSchemas([
        "osdu:wks:master-data--TubularAssembly:2.0.0",
    ]);

    console.group("Rerender triggered");

    console.group("Single Record");
    console.log("Loading:", recordLoading);
    console.log(record);
    console.groupEnd();

    console.group("Multiple records");
    console.log("Loading: ", recordsLoading);
    console.log(records);
    console.groupEnd();

    console.group("Multiple schemas");
    console.log("Loading: ", schemasLoading);
    console.log(schemas);
    console.groupEnd();

    console.group("Single Schema");
    console.log("Loading:", schemaLoading);
    console.log(schema);
    console.groupEnd();

    console.groupEnd();

    return (
        <section>
            <div>Seeding is done: {String(seedingIsDone)}</div>
        </section>
    );
}

function OSDUAdmin() {
    useDbSeeder();
    const identifiers = useIdentifiers();
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Tabs
            activeTab={activeTab}
            onChange={(index) => setActiveTab(Number(index))}
        >
            <Tabs.List>
                <Tabs.Tab>New record +</Tabs.Tab>
                {identifiers.map((tabTitle, index) => (
                    <Tabs.Tab key={index}>{truncateTitle(tabTitle)}</Tabs.Tab>
                ))}
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel>
                    <NewRecordPanel />
                </Tabs.Panel>
                {identifiers.map((id) => (
                    <Tabs.Panel key={id}>
                        <RecordPanel identifier={id} />
                    </Tabs.Panel>
                ))}
            </Tabs.Panels>
        </Tabs>
    );
}


export { OSDUAdmin };
