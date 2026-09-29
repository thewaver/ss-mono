export type ToggleExampleProps = {
    "checked": boolean;
    "onUpdate:checked"?: (isChecked: boolean) => void;
};

export type ToggleMixedExampleProps = {
    "all": boolean;
    "onUpdate:all"?: (isChecked: boolean) => void;
    "firstChild": boolean;
    "onUpdate:firstChild"?: (isChecked: boolean) => void;
    "secondChild": boolean;
    "onUpdate:secondChild"?: (isChecked: boolean) => void;
    "isMixed": boolean;
};
