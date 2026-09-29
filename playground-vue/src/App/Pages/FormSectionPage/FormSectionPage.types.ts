export type FormSectionsExampleProps = {
    "email": string;
    "onUpdate:email"?: (value: string) => void;
    "password": string;
    "onUpdate:password"?: (value: string) => void;
    "confirm": string;
    "onUpdate:confirm"?: (value: string) => void;
    "onSubmit": () => void;
    "onReset": () => void;
};

export type FormSectionNestedExampleProps = {
    "street": string;
    "onUpdate:street"?: (value: string) => void;
    "card": string;
    "onUpdate:card"?: (value: string) => void;
    "onSubmit": () => void;
};
