import {Table} from "@equinor/eds-core-react";
import {useState} from "react";
import type {OSDURecord} from "../../types/osdu.ts";

type RecordRowProps = {
    record: OSDURecord;
    id?: string;
}
export function RecordRow({ record }: RecordRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    
    if (record) {
    const data = Object.values(record.data ?? {});
        return (
            <Table.Row key={record.id} onClick={() => setIsEditing(!isEditing)}>
                {data.map((d, index) => <RecordCell key={record.id + index} recordProp={d} />)}
            </Table.Row>
        )
    }    
}

type RecordCellProps = {
    recordProp: unknown
}

/* Renders a single cell.
* In the POC, we will only render the cell if the prop is not a complex type. */
export function RecordCell({recordProp}: RecordCellProps) {
    if (typeof recordProp === "number" || typeof recordProp === "string") {
        return <Table.Cell variant="input">{recordProp}</Table.Cell>
    } else return null;
}