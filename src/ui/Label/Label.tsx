import { Icon, Label, Tooltip } from "@equinor/eds-core-react";
import { info_circle } from "@equinor/eds-icons";
import type { OSDUField } from "../../types/form";
import "./styles.css";

type RecordLabelProps = {
    id: string;
    field: OSDUField;
};

export function RecordLabel({ id, field }: RecordLabelProps) {
    return (
        <div className="label-container">
            <Label htmlFor={id} label={field.title} />
            <Tooltip
                placement={"left"}
                enterDelay={500} //ms
                title={field.description}
            >
                <Icon data={info_circle} className="hover-icon" color="grey" />
            </Tooltip>
        </div>
    );
}
