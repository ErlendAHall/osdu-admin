import { useFormGenerator } from "./hooks/useFormGenerator.tsx";
import {
    Button,
    Paper,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
} from "@equinor/eds-core-react";
import { type FormEvent, useEffect, useState } from "react";
import { useIndexedDb } from "./hooks/useIndexedDb.ts";
import { useUnsavedRecord } from "./hooks/useUnsavedRecord.ts";
import type { UnsavedOSDURecord } from "../types/osdu.ts";

type RecordPanelProps = {
    /* The unique ID of the record. */
    identifier: string;
};

export function RecordPanel({ identifier }: RecordPanelProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [, setUnsavedChanges] = useState<UnsavedOSDURecord>();
    const [kind, setKind] = useState<string | undefined>(undefined);
    const { dbInstance } = useIndexedDb();
    const formFields = useFormGenerator(kind, identifier);
    const { saveNewChanges } = useUnsavedRecord(identifier);

    /* This side-effect does a lookup of the schema kind based on a certain record identifier. */
    useEffect(() => {
        if (dbInstance) {
            dbInstance.resolveKindFromRecord(identifier).then(setKind);
        }
    }, [identifier, dbInstance]);

    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const partial: UnsavedOSDURecord = {};
        const inputElements = Array.from(form).filter(
            (el) => el instanceof HTMLInputElement
        );
        inputElements.forEach((i) => {
            if (i.value) {
                // @ts-expect-error Temporary code
                partial[i.id] = i.value;
            }
        });
        setUnsavedChanges(partial);
        setShowDialog(true);
        saveNewChanges(partial);
    }

    return (
        <>
            <Dialog
                open={showDialog}
                style={{ maxHeight: "500px", width: "100%", overflow: "auto" }}
            >
                <DialogContent>
                    <article>
                        <p>
                            This dialog shows all data that has been collected
                            from the form below and is what will be posted to
                            /records
                        </p>
                    </article>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <form onSubmit={handleFormSubmit}>
                <article>
                    <p>
                        This HTML form was generated from a schema file which is
                        loaded into IndexedDB.
                    </p>
                    <p>
                        The schemas can be inspected from the devtools in most
                        browsers. In Chromium, it is located in Application tab
                        -{">"} IndexedDB in sidebar -{">"} OSDUAdminDatabase -
                        {">"} OSDUSchemaStore
                    </p>
                    <p>
                        There are no external data sources present at this time
                        and all the records and schemas are seeded from
                        sideloaded assets.
                    </p>
                </article>
                <fieldset className="record-fields">
                    {formFields.map((formField) => formField)}
                </fieldset>
                <fieldset>
                    <Paper elevation="sticky" id="elevated-menu">
                        {/*<Tooltip title="Reset form to last save state.">*/}
                        {/*    <Button color="danger" id="reset-button">*/}
                        {/*        Reset*/}
                        {/*    </Button>*/}
                        {/*</Tooltip>*/}
                        {/*<Tooltip title="Undo last change">*/}
                        {/*    <Button color="secondary" id="undo-button">*/}
                        {/*        Undo*/}
                        {/*    </Button>*/}
                        {/*</Tooltip>*/}
                        <Tooltip title="Save changes to OSDU">
                            <Button
                                color="primary"
                                id="save-button"
                                type="submit"
                            >
                                Save
                            </Button>
                        </Tooltip>
                    </Paper>
                </fieldset>
            </form>
        </>
    );
}
