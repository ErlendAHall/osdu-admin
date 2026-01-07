import { type ReactNode, useEffect, useMemo, useState } from "react";
import { DatePicker, Input, Switch, Tooltip } from "@equinor/eds-core-react";
import type { OSDUField } from "../../types/form.ts";
import { collectNodesWithRequiredProps } from "../../traverser.ts";
import { useRecord } from "./useRecord.ts";
import { useSchema } from "./useSchema.ts";
import { RecordLabel } from "../Label/Label.tsx";

/* Accepts a kind and an identifier and creates a list of HTML form fields ready for DOM. */
export function useFormGenerator(kind?: string, identifier?: string) {
    const { record } = useRecord(identifier);
    const { schema } = useSchema(kind);
    const [osduFields, setOsduFields] = useState<OSDUField[]>([]);
    const [htmlNodes, setHtmlNodes] = useState<ReactNode[]>([]);

    /* When we have schema, we can start mapping form fields. */
    useMemo(() => {
        if (!schema) return;
        collectNodesWithRequiredProps(schema, record).then((fields) =>
            setOsduFields(fields)
        );
    }, [record, schema]);

    useEffect(() => {
        const nodes: ReactNode[] = [];
        const tooltipDelay = 500; //ms

        osduFields.forEach((field, index) => {
            // Field is integer or number.
            if (field.type === "number" || field.type === "integer") {
                const id = `number-input-${index}`;
                nodes.push(
                    <div key={field.title + index}>
                        <RecordLabel id={id} field={field} />
                        <Input
                            onChange={() => {}}
                            type="number"
                            id={field.identifier}
                            value={field.value}
                            data-path={field.path}
                        />
                    </div>
                );

                // Field is string or date.
            } else if (field.type === "string") {
                const id = `string-input-${index}`;
                nodes.push(
                    <div key={field.title + index}>
                        <RecordLabel id={id} field={field} />
                        {field?.format === "date-time" &&
                        typeof field.value === "string" ? (
                            <DatePicker
                                id={field.identifier}
                                onChange={() => {}}
                                value={new Date(String(field.value))}
                            />
                        ) : (
                            <Input
                                id={field.identifier}
                                autoComplete="off"
                                value={field.value}
                                onChange={() => {}}
                                data-path={field.path}
                            />
                        )}
                    </div>
                );

                // Field is a boolean.
            } else if (
                field.type === "boolean" &&
                typeof field.value === "boolean"
            ) {
                const id = `boolean-input-${index}`;
                nodes.push(
                    <div key={id}>
                        <Tooltip
                            placement={"left"}
                            enterDelay={tooltipDelay}
                            title={field.description}
                        >
                            <Switch
                                id={field.identifier}
                                label={field.title}
                                checked={field.value}
                                onChange={() => {}}
                                data-path={field.path}
                            />
                        </Tooltip>
                    </div>
                );
            } else {
                const id = `typeless-input-${index}`;
                nodes.push(
                    <div key={field.title + index}>
                        <RecordLabel id={id} field={field} />
                        <Input
                            onChange={() => {}}
                            id={field.identifier}
                            value={field.value}
                            data-path={field.path}
                        />
                    </div>
                );
            }
        });

        setHtmlNodes(nodes);
    }, [osduFields]);

    return htmlNodes;
}
