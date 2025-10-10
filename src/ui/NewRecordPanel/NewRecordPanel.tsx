import {Autocomplete, Button, Checkbox, Search, Tabs, Typography,} from "@equinor/eds-core-react";
import {useEffect, useState} from "react";
import "./styles.css";
import {fetchSchemaNames} from "../../rest/schema.ts";
import {useIndexedDb} from "../hooks/useIndexedDb.ts";
import {ObjectStores} from "../../indexeddb/indexedDbHandler.ts";
import {getEntityRecord} from "../../rest/record.ts";

export function NewRecordPanel() {
    const [options, setOptions] = useState<string[]>([]);
    const [autogenIdEnabled, setAutogenIdEnabled] = useState(true);
    useEffect(() => {
        fetchSchemaNames().then(setOptions);
    }, []);
    const { writeItem } = useIndexedDb();

    // TODO: Provide error handling

    return (
        <Tabs.Panel>
            <section className="create_record">
                <form>
                    <Typography variant="accordion_header" group="ui">
                        Create a new record
                    </Typography>
                    <Autocomplete
                        label=""
                        placeholder="kind"
                        id="new-record"
                        options={options}
                    />
                    {!autogenIdEnabled && (
                        <em>TODO: Provide textfield to manually set a id.</em>
                    )}
                    <fieldset className="record-create-fieldset">
                        <Checkbox
                            checked={autogenIdEnabled}
                            label="Autogenerate record identifier"
                            onChange={() =>
                                setAutogenIdEnabled(!autogenIdEnabled)
                            }
                        />
                        <Button onClick={() => console.log("create record")}>
                            Create
                        </Button>
                    </fieldset>
                </form>
            </section>

            <section className="edit_record">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const searchElement = (e.target as HTMLFormElement)
                            .elements.namedItem("identifier-search") as HTMLInputElement;
                        if (searchElement.value) {
                            const record = await getEntityRecord(searchElement.value);
                            await writeItem(record, ObjectStores.OSDURecordStore);
                        }
                    }}
                >
                    <Typography variant="accordion_header" group="ui">
                        Open an existing record
                    </Typography>
                    <Search
                        id={"identifier-search"}
                        placeholder={"identifier"}
                        aria-label="Search by identifier"
                    ></Search>
                    <Button type={"submit"}>Open</Button>
                </form>
            </section>
            <section>
                <p>Identifiers to test with</p>
                <ul>
                    <li>namespace:master-data--Well:c0ffeeb0-1dea-5e1a-8b0b-deadbeef1234</li>
                    <li>namespace:master-data--BHARun:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed</li>
                    <li>namespace:master-data--BHARun:6ba7b810-9dad-11d1-80b4-00c04fd430c8</li>
                    <li>namespace:master-data--BHARun:a828c845-101a-5ca0-a729-84fe19cf8841</li>
                    <li>namespace:master-data--HoleSection:7f24cc1c-5a82-4c7a-98a4-2d1e1c84b3a2</li>
                    <li>namespace:master-data--HoleSection:9616795e-1fc1-50a2-b40f-e509668b514f</li>
                    <li>namespace:master-data--TubularAssembly:6494d378-e4df-5ca2-a913-a061a085aada</li>
                    <li>namespace:master-data--TubularAssembly:e91a3b8f-22d5-4e0d-95fc-123456789abc</li>
                    <li>namespace:master-data--Well:4d2e6f12-9c44-41b8-bbff-8a3b14c7d5e1</li>
                    <li>namespace:master-data--Well:6c60ceb0-3521-57b7-9bd8-e1d7c9f66230</li>
                    <li>namespace:master-data--Well:2a8bcf33-1d7e-4f2a-9e0b-87f65d43e21c</li>
                </ul>
            </section>
        </Tabs.Panel>
    );
}
