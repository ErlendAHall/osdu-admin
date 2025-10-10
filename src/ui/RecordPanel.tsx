import {useFormGenerator} from "./hooks/useFormGenerator.tsx";
import {Button, Paper, Tooltip} from "@equinor/eds-core-react";
import {useEffect, useState} from "react";
import {useIndexedDb} from "./hooks/useIndexedDb.ts";

type RecordPanelProps = {
    /* The unique ID of the record. */
    identifier: string;
};

export function RecordPanel({ identifier }: RecordPanelProps) {
    const [kind, setKind] = useState<string | undefined>(undefined);
    const { dbInstance } = useIndexedDb();
    const formFields = useFormGenerator(kind, identifier);

    /* This side-effect does a lookup of the schema kind based on a certain record identifier. */
    useEffect(() => {
        if (dbInstance) {
            dbInstance.resolveKindFromRecord(identifier).then(setKind);
        }
        
    }, [identifier, dbInstance]);


    return (
        <form>
            <fieldset className="record-fields">{formFields.map((formField) => formField)}</fieldset>
            <fieldset>
                <Paper elevation="sticky" id="elevated-menu">
                    <Tooltip title="Reset form to last save state.">
                        <Button color="danger" id="reset-button">
                            Reset
                        </Button>
                    </Tooltip>
                    <Tooltip title="Undo last change">
                        <Button color="secondary" id="undo-button">
                            Undo
                        </Button>
                    </Tooltip>
                    <Tooltip title="Save changes to OSDU">
                        <Button color="primary" id="save-button" type="submit">
                            Save
                        </Button>
                    </Tooltip>
                </Paper>
            </fieldset>
        </form>
    );
}
