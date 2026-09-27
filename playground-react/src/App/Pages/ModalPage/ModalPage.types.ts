export type ModalExampleProps = {
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
};

export type ModalDestructiveExampleProps = ModalExampleProps & {
    onDecide: (outcome: string) => void;
};

export type ModalLayeredExampleProps = ModalExampleProps & {
    valueState: readonly [string | undefined, (value: string | undefined) => void];
};
