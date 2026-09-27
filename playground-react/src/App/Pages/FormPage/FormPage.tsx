import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { FocusOnErrorExample } from "./Examples/FocusOnError";
import { SignUpExample } from "./Examples/SignUp";
import type { FormExampleProps } from "./FormPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormPage/Examples";

export const FormPage = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const termsState = useState(false);

    const [outcome, setOutcome] = useState("not submitted");

    const planState = useState<string | undefined>();
    const topicsState = useState<string[]>([]);

    const [focusOutcome, setFocusOutcome] = useState("not submitted");

    const commonProps: FormExampleProps = {
        emailState,
        passwordState,
        termsState,
        onSubmit: () => {
            setOutcome(`submitted as ${emailState[0]}`);
        },
        onReset: () => {
            setOutcome("not submitted");
        },
    };

    const examples = [
        {
            key: "reportsValidity",
            name: "A form that reports its own validity",
            readout: () => `outcome: ${outcome}`,
            component: () => <SignUpExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/SignUp.tsx`,
        },
        {
            key: "focusOnError",
            name: "Submitting moves focus to the first error",
            readout: () =>
                `outcome: ${focusOutcome} — the handler runs either way, and afterwards focus lands on the first field reporting an error`,
            component: () => (
                <FocusOnErrorExample
                    planState={planState}
                    topicsState={topicsState}
                    onSubmit={() => {
                        setFocusOutcome(`submitted as ${planState[0] ?? "no plan"}, [${topicsState[0].join(", ")}]`);
                    }}
                    onReset={() => {
                        planState[1](undefined);
                        topicsState[1]([]);
                        setFocusOutcome("not submitted");
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/FocusOnError.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
