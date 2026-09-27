export type CheckboxCheckedState = readonly [boolean, (isChecked: boolean) => void];

export type CheckboxExampleProps = {
    checkedState: CheckboxCheckedState;
};

export type CheckboxMixedExampleProps = {
    allState: CheckboxCheckedState;
    firstChildState: CheckboxCheckedState;
    secondChildState: CheckboxCheckedState;
    isMixed: boolean;
};

export type CheckboxRefusedWriteExampleProps = {
    emailState: CheckboxCheckedState;
    smsState: CheckboxCheckedState;
};
