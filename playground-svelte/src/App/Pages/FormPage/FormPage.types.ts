export type FormExampleProps = {
    email: string;
    password: string;
    terms: boolean;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormFocusExampleProps = {
    plan: string | undefined;
    topics: string[];
    onSubmit: () => void;
    onReset: () => void;
};
