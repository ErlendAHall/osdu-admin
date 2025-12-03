import { useRecordsByKind } from "../hooks/useRecordsByKind.ts";
import { Table } from "@equinor/eds-core-react";
import { RecordRow } from "./RecordRow.tsx";


type RecordTableProps = {
    kind: string;
}

type TableData = {
    [key: string]: unknown;
}
export function RecordTable({ kind }: RecordTableProps) {
    const { records } = useRecordsByKind(kind)

    const tableData: TableData = {};

    records.forEach((record) => {
        for (let t in record.data) {
            if (typeof record.data[t] === "string" || typeof record.data[t] === "number") {
                tableData[t] = record.data[t];
            }
        }
    });


    return (
        <Table>
            <Table.Head>
                <Table.Row>
                    {Object.keys(tableData).map((dt => <Table.Cell key={dt}>{dt}</Table.Cell>))}
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {Object.values(tableData).map((_, index) => <RecordRow key={records[index]?.id ?? index} record={records[index]} />)}
            </Table.Body>
        </Table>
    );
}