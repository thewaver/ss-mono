import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextAreaProps } from "./TextAreaSolid.types";

export const TextArea = (props: TextAreaProps) => <TextField {...props} element={"textarea"} />;
