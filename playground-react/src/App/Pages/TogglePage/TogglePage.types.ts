export type ToggleExampleProps = {
    checked: readonly [boolean, (isChecked: boolean) => void];
};

export type ToggleMixedExampleProps = {
    all: readonly [boolean, (isChecked: boolean) => void];
    firstChild: readonly [boolean, (isChecked: boolean) => void];
    secondChild: readonly [boolean, (isChecked: boolean) => void];
    isMixed: boolean;
};
