export type TextFieldElementType = "input" | "textarea";

export type TextFieldType = "text" | "email" | "number" | "password" | "search" | "tel" | "url";

export type TextFieldFlags = {
    isEmpty: boolean;
    isReadOnly: boolean;
};

export type TextFieldMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
