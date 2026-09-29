export type CheckboxExampleProps = {
    "checked": boolean;
    "onUpdate:checked"?: (isChecked: boolean) => void;
};

export type CheckboxMixedExampleProps = {
    "all": boolean;
    "onUpdate:all"?: (isChecked: boolean) => void;
    "firstChild": boolean;
    "onUpdate:firstChild"?: (isChecked: boolean) => void;
    "secondChild": boolean;
    "onUpdate:secondChild"?: (isChecked: boolean) => void;
    "isMixed": boolean;
};

export type CheckboxRefusedWriteExampleProps = {
    "email": boolean;
    "onUpdate:email"?: (isChecked: boolean) => void;
    "sms": boolean;
    "onUpdate:sms"?: (isChecked: boolean) => void;
};
