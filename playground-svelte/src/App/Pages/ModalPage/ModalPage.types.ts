export type ModalExampleProps = {
    visibility: boolean;
};

export type ModalDestructiveExampleProps = ModalExampleProps & {
    onDecide: (outcome: string) => void;
};

export type ModalLayeredExampleProps = ModalExampleProps & {
    value: string | undefined;
};
