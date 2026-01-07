export type OSDUField = {
    identifier: string;
    /* Describes the property */
    description: string;

    /* Used as the form field label */
    title: string;

    /* Used to determine type of form field. */
    type?: string;

    /* Additionally describes the type*/
    format?: string;

    /* Used in validation. */
    pattern?: string;

    /* To aid the user in how the attribute is built. */
    example?: string;

    /* The record path */
    path: string;

    /* The field value. */
    value: string | number | boolean | null | undefined;
};
