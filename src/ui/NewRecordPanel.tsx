import {NativeSelect, Search, Tabs} from "@equinor/eds-core-react";

export function NewRecordPanel() {
    
    return (
        <Tabs.Panel>
        <p>Create a new record.</p>
            <NativeSelect label="New record" id="new-record">
                <option>BHARun 2.0.0</option>
                <option>HoleSection 1.2.0</option>
                <option>Foobar 3.0.0</option>
            </NativeSelect>
            
            <p>... or open an existing record</p>
            <form>
                <Search aria-label="Search by identifier"></Search>
            </form>
    </Tabs.Panel>
    );
    
    
}