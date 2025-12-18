import { Table } from "@equinor/eds-core-react";
import { HOCRecordCell } from "./RecordCell.tsx";
import { useRecord } from "../hooks/useRecord.ts";

type RecordRowProps = {
    recordIdentifier: string;
    id?: string;
};
export function RecordRow({ recordIdentifier }: RecordRowProps) {
    const { record, updateRecord } = useRecord(recordIdentifier);

    if (record) {
        const filteredRecords = Object.fromEntries(
            Object.entries(record.data).filter(
                ([, value]) =>
                    typeof value === "string" || typeof value === "number"
            )
        ) as Record<string, string | number>;

        return (
            <Table.Row key={record.id}>
                {Object.entries(filteredRecords).map(([key, value]) => (
                    <HOCRecordCell
                        key={key}
                        cellData={{ [key]: value }}
                        onChange={updateRecord}
                    />
                ))}
            </Table.Row>
        );
    }
}
