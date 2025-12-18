import { Table, Input } from "@equinor/eds-core-react";
import { useState } from "react";
import type { OSDURecord } from "../../types/osdu";

type RecordCellProps = {
    cellData: Partial<OSDURecord>;
    onBeginEdit?: () => void;
    onFocusLost?: () => void;
    onChange?: (newRecord: Partial<OSDURecord>) => void;
};

type HOCRecordCellProps = RecordCellProps;

/**
 * A higher order component that returns either a read-only table cell or an editable version.
 */
export function HOCRecordCell(props: HOCRecordCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    //TODO: Can we use uncontrolled input components or alternatively move this state to indexeddb?
    const [value, setValue] = useState(props.cellData);

    function handleChange(newValue: Partial<OSDURecord>) {
        if (props.onChange) {
            props.onChange(newValue);
            setValue(newValue);
        }
    }

    if (isEditing) {
        return (
            <EditableRecordCell
                cellData={value}
                onFocusLost={() => setIsEditing(false)}
                onChange={handleChange}
            />
        );
    }

    return (
        <RecordCell cellData={value} onBeginEdit={() => setIsEditing(true)} />
    );
}

/* Renders a single cell.
 * In the POC, we will only render the cell if the prop is not a complex type. */
export function RecordCell({ cellData, onBeginEdit }: RecordCellProps) {
    const value = Object.values(cellData)[0];

    if (typeof value === "string") {
        return (
            <Table.Cell
                variant="input"
                className="simpleCell"
                onDoubleClick={() => onBeginEdit!()}
            >
                <div>{value}</div>
            </Table.Cell>
        );
    }
}

export function EditableRecordCell({
    cellData,
    onFocusLost,
    onChange,
}: RecordCellProps) {
    const key = Object.keys(cellData)[0];
    const value = Object.values(cellData)[0];

    return (
        <Table.Cell variant="input" className="simpleCell">
            <Input
                type="text"
                value={value}
                onBlur={() => onFocusLost!()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange?.({ [key]: e.target.value })
                }
            />
        </Table.Cell>
    );
}
