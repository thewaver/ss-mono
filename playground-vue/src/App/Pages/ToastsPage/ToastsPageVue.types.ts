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

export type ToastsOwnPainterRaisersProps = {
    hasDraft: boolean;
    onDelete: () => void;
    onRestore: () => void;
};

export type ToastsFarDownShowAnswer = {
    id: string | undefined;
};

export type ToastsFarDownSaveButtonProps = {
    id: string;
    caption: string;
    onAnswer: (answer: ToastsFarDownShowAnswer) => void;
};

export type ToastsFarDownNestingProps = Pick<ToastsFarDownSaveButtonProps, "onAnswer">;
