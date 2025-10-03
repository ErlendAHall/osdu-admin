import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  Input,
  Label,
  Switch,
  Tooltip,
} from "@equinor/eds-core-react";
import type { OSDUField } from "../types/form";
import { useRecord, useSchema } from "./useIndexedDb.ts";
import { collectNodesWithRequiredProps } from "../traverser.ts";

/* Accepts a kind and an identifier and creates a list of HTML form fields ready for DOM. */
export function useFormGenerator(kind: string, identifier: string) {
  const record = useRecord(identifier);
  const schema = useSchema(kind);
  const [osduFields, setOsduFields] = useState<OSDUField[]>([]);
  const [htmlNodes, setHtmlNodes] = useState<ReactNode[]>([]);

  /* When we have both schema and record, we can start mapping form fields. */
  useMemo(() => {
    if (!record || !schema) return;
    collectNodesWithRequiredProps(schema).then((fields) =>
      setOsduFields(fields)
    );
  }, [record, schema]);

  useEffect(() => {
    const nodes: ReactNode[] = [];
    const tooltipDelay = 1000; //ms

    osduFields.forEach((field, index) => {
      // Field is integer or number.
      if (field.type === "number" || field.type === "integer") {
        const id = `number-input-${index}`;
        nodes.push(
          <div key={field.title + index}>
            <Tooltip
              placement={"left-end"}
              enterDelay={tooltipDelay}
              title={field.description}
            >
              <Label htmlFor={id} label={field.title} />
            </Tooltip>
            <Input type="number" id={id} value={field.value} />
          </div>
        );

        // Field is string or date.
      } else if (field.type === "string") {
        const id = `string-input-${index}`;
        nodes.push(
          <div key={field.title + index}>
            <Tooltip
              placement={"left"}
              enterDelay={tooltipDelay}
              title={field.description}
            >
              <Label htmlFor={id} label={field.title} />
            </Tooltip>
            {field?.format === "date-time" && typeof field.value ? (
              <DatePicker id={id} />
            ) : (
              <Input
                id={id}
                autoComplete="off"
                value={field.value}
                onChange={() => {}}
              />
            )}
          </div>
        );

        // Field is a boolean.
      } else if (field.type === "boolean" && typeof field.value === "boolean") {
        const id = `boolean-input-${index}`;
        nodes.push(
          <div key={id}>
            <Tooltip
              placement={"left"}
              enterDelay={tooltipDelay}
              title={field.description}
            >
              <Switch id={id} label={field.title} checked={field.value} />
            </Tooltip>
          </div>
        );
      }
    });

    setHtmlNodes(nodes);
  }, [osduFields]);

  return htmlNodes;
}
