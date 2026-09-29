export type CheckboxCheckedState = readonly [boolean, (isChecked: boolean) => void];

export type CheckboxExampleProps = {
    checked: CheckboxCheckedState;
};

export type CheckboxMixedExampleProps = {
    all: CheckboxCheckedState;
    firstChild: CheckboxCheckedState;
    secondChild: CheckboxCheckedState;
    isMixed: boolean;
};

export type CheckboxRefusedWriteExampleProps = {
    email: CheckboxCheckedState;
    sms: CheckboxCheckedState;
};
