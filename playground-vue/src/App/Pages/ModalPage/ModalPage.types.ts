export type ModalExampleProps = {
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
};

export type ModalDestructiveExampleProps = ModalExampleProps & {
    onDecide: (outcome: string) => void;
};

export type ModalLayeredExampleProps = ModalExampleProps & {
    "value": string | undefined;
    "onUpdate:value"?: (value: string | undefined) => void;
};
