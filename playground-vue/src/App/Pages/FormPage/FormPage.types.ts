export type FormExampleProps = {
    "email": string;
    "onUpdate:email"?: (value: string) => void;
    "password": string;
    "onUpdate:password"?: (value: string) => void;
    "terms": boolean;
    "onUpdate:terms"?: (value: boolean) => void;
    "onSubmit": () => void;
    "onReset": () => void;
};

export type FormFocusExampleProps = {
    "plan": string | undefined;
    "onUpdate:plan"?: (value: string | undefined) => void;
    "topics": string[];
    "onUpdate:topics"?: (values: string[]) => void;
    "onSubmit": () => void;
    "onReset": () => void;
};
