export type ToggleExampleProps = {
    checkedState: readonly [boolean, (isChecked: boolean) => void];
};

export type ToggleMixedExampleProps = {
    allState: readonly [boolean, (isChecked: boolean) => void];
    firstChildState: readonly [boolean, (isChecked: boolean) => void];
    secondChildState: readonly [boolean, (isChecked: boolean) => void];
    isMixed: boolean;
};
