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
        </Tabs.Panel>
    );
}
