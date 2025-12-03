import { Table } from "@equinor/eds-core-react";
import type { OSDURecord } from "../../types/osdu.ts";
import { HOCRecordCell } from "./RecordCell.tsx";

type RecordRowProps = {
    record: OSDURecord;
    id?: string;
};
export function RecordRow({ record }: RecordRowProps) {
    if (record) {
        // Filter out complex tabular data. We just want to deal with numbers and strings for now.
        const data = Object.values(record.data ?? {}).filter(
            (d) => typeof d === "number" || typeof d === "string"
        );
        return (
            <Table.Row key={record.id}>
                {data.map((d, index) => (
                    <HOCRecordCell key={record.id + index} recordProp={d} />
                ))}
            </Table.Row>
        );
    }
}