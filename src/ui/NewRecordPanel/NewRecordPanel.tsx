import { Button, Search, Tabs, Progress } from "@equinor/eds-core-react";
import { useState } from "react";
import "./styles.css";
import { useIndexedDb } from "../hooks/useIndexedDb.ts";
import { getEntityRecord } from "../../rest/record.ts";
import { ObjectStores } from "../../types/db.ts";

export function NewRecordPanel() {
    const { writeItem } = useIndexedDb();
    const [isLoading, setIsLoading] = useState(false);

    function simulateLoading(): Promise<undefined> {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                resolve(undefined);
            }, 2000);
        });
    }

    // TODO: Provide error handling

    return (
        <Tabs.Panel>
            <section className="edit_record">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const searchElement = (
                            e.target as HTMLFormElement
                        ).elements.namedItem(
                            "identifier-search"
                        ) as HTMLInputElement;
                        if (searchElement.value) {
                            const record = await getEntityRecord(
                                searchElement.value
                            );
                            await writeItem(
                                record,
                                ObjectStores.OSDURecordStore
                            );
                        }
                    }}
                >
                    <h3>Open an existing record:</h3>
                    <Search
                        id={"identifier-search"}
                        placeholder={"identifier"}
                        aria-label="Search by identifier"
                    ></Search>
                    <Button onClick={() => simulateLoading()} type={"submit"}>
                        Open
                    </Button>
                    {isLoading && <Progress.Circular />}
                </form>
            </section>
            <section style={{ margin: "1rem" }}>
                <h3>Note:</h3>
                <article>
                    <p>
                        In this view you can open an existing record by
                        copy-pasting one of the record identifiers below into
                        the textfield above.
                    </p>
                    <p>
                        Other identifiers will not work since this POC is not
                        hooked up to any data providers.
                    </p>
                </article>
            </section>
            <section style={{ margin: "1rem" }}>
                <h4>Records to test with:</h4>
                <ul>
                    <li>
                        namespace:master-data--Well:c0ffeeb0-1dea-5e1a-8b0b-deadbeef1234
                    </li>
                    <li>
                        namespace:master-data--BHARun:1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
                    </li>
                    <li>
                        namespace:master-data--BHARun:6ba7b810-9dad-11d1-80b4-00c04fd430c8
                    </li>
                    <li>
                        namespace:master-data--HoleSection:7f24cc1c-5a82-4c7a-98a4-2d1e1c84b3a2
                    </li>
                    <li>
                        namespace:master-data--TubularAssembly:e91a3b8f-22d5-4e0d-95fc-123456789abc
                    </li>
                    <li>
                        namespace:master-data--Well:4d2e6f12-9c44-41b8-bbff-8a3b14c7d5e1
                    </li>
                    <li>
                        namespace:master-data--Well:6c60ceb0-3521-57b7-9bd8-e1d7c9f66230
                    </li>
                    <li>
                        namespace:master-data--Well:2a8bcf33-1d7e-4f2a-9e0b-87f65d43e21c
                    </li>
                </ul>
            </section>
        </Tabs.Panel>
    );
}
