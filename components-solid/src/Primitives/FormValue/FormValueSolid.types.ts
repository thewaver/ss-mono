import type { AccessorProps } from "../../Utils/typeUtils";

export type FormValueProps = AccessorProps<{
    /** The name the values are submitted under. Left out, nothing is drawn. */
    name?: string;
    /** The texts to submit, one entry each under the name. An empty list submits nothing. */
    values: string[];
}>;
