export type OSDUSchema = {
    "x-osdu-schema-source": string;
    "x-osdu-license": string;
    $id: string;
    $schema: string;
    title: string;
    description: string;
    type: string;
    properties?: Record<string, unknown>;
    required: string[];
    additionalProperties: boolean;
    "x-osdu-review-status": string;
    "x-osdu-virtual-properties"?: Record<string, unknown>;
    "x-osdu-inheriting-from-kind"?: Array<Record<string, unknown>>;
};

export type OSDURecord = {
    id: string;
    kind: string;
    data: RecordData;
};

export type RecordData = {
    [key: string]: string | number | RecordData;
};

export type UnsavedOSDURecord = Partial<OSDURecord>;
