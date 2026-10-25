import type {
    BaseToastsAnimationDocsExampleValues,
    BaseToastsDurationDocsExampleValues,
    BaseToastsLimitDocsExampleValues,
    BaseToastsPlacementDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.types";

export type ToastsPlacementDocsExampleProps = BaseToastsPlacementDocsExampleValues;

export type ToastsLimitDocsExampleProps = BaseToastsLimitDocsExampleValues;

export type ToastsDurationDocsExampleProps = BaseToastsDurationDocsExampleValues;

export type ToastsAnimationDocsExampleProps = BaseToastsAnimationDocsExampleValues;

export type ToastsDurationRaisersProps = ToastsDurationDocsExampleProps & {
    onShow: () => void;
    onHide: () => void;
};

export type ToastsShowAnswer = {
    id: string | undefined;
};

export type ToastsFarDownProps = {
    onAnswer: (answer: ToastsShowAnswer) => void;
};

export type ToastsSaveButtonProps = ToastsFarDownProps & {
    id: string;
    caption: string;
};

export type ToastsOwnPainterRaisersProps = {
    hasDraft: boolean;
    onDelete: () => void;
    onRestore: () => void;
};
