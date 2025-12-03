import { Table, Input } from "@equinor/eds-core-react";
import { useState } from "react";

type RecordCellProps = {
    recordProp: string | number;
    onBeginEdit?: () => void;
    onFocusLost?: () => void;
    onChange?: (newValue: string) => void;
};

type HOCRecordCellProps = RecordCellProps;

/**
 * A higher order component that returns either a read-only table cell or an editable version.
 */
export function HOCRecordCell(props: HOCRecordCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string | number>(props.recordProp);

    if (
        typeof props.recordProp !== "number" &&
        typeof props.recordProp !== "string"
    ) {
        return null;
    }

    if (isEditing) {
        return (
            <EditableRecordCell
                recordProp={value}
                onFocusLost={() => setIsEditing(false)}
                onChange={setValue}
            />
        );
    }

    return (
        <RecordCell recordProp={value} onBeginEdit={() => setIsEditing(true)} />
    );
}

/* Renders a single cell.
 * In the POC, we will only render the cell if the prop is not a complex type. */
export function RecordCell({
    recordProp,
    onBeginEdit,
}: RecordCellProps) {
    return (
        <Table.Cell
            variant="input"
            className="simpleCell"
            onDoubleClick={() => onBeginEdit!()}
        >
            <div>{recordProp}</div>
        </Table.Cell>
    );
}

export function EditableRecordCell({
    recordProp,
    onFocusLost,
    onChange
}: RecordCellProps) {
    return (
        <Table.Cell variant="input" className="simpleCell">
            <Input
                type="text"
                value={recordProp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange!(e.target.value ?? "")
                }
                onBlur={() => onFocusLost!()}
            />
        </Table.Cell>
    );
}
