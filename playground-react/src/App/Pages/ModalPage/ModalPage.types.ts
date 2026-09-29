export type ModalExampleProps = {
    visibility: readonly [boolean, (isVisible: boolean) => void];
};

export type ModalDestructiveExampleProps = ModalExampleProps & {
    onDecide: (outcome: string) => void;
};

export type ModalLayeredExampleProps = ModalExampleProps & {
    value: readonly [string | undefined, (value: string | undefined) => void];
};
