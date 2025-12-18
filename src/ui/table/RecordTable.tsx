import { Table } from "@equinor/eds-core-react";
import { RecordRow } from "./RecordRow.tsx";
import { useIdentifiers } from "../hooks/useIdentifiers.ts";

type RecordTableProps = {
    kind: string;
};

export function RecordTable({ kind }: RecordTableProps) {
    const identifiers = useIdentifiers(kind);

    return (
        <Table>
            <Table.Head>
                <Table.Row>{/*How to get the table headers here?*/}</Table.Row>
            </Table.Head>
            <Table.Body>
                {identifiers.map((recordId, index) => (
                    <RecordRow
                        key={recordId ?? index}
                        recordIdentifier={recordId}
                    />
                ))}
            </Table.Body>
        </Table>
    );
}
