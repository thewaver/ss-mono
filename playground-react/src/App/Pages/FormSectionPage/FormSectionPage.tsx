import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { NestedExample } from "./Examples/Nested";
import { SectionsExample } from "./Examples/Sections";
import type { FormSectionsExampleProps } from "./FormSectionPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormSectionPage/Examples";

export const FormSectionPage = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const confirmState = useState("");

    const streetState = useState("");
    const cardState = useState("");

    const [outcome, setOutcome] = useState("not submitted");
    const [nestedOutcome, setNestedOutcome] = useState("not submitted");

    const sectionsProps: FormSectionsExampleProps = {
        emailState,
        passwordState,
        confirmState,
        onSubmit: () => {
            setOutcome(`submitted as ${emailState[0]}`);
        },
        onReset: () => {
            setOutcome("not submitted");
        },
    };

    const examples = [
        {
            key: "sections",
            name: "Sections with their own validity",
            readout: () =>
                `outcome: ${outcome} — each field reports to its own section, and the form hears one answer per section rather than one per field`,
            component: () => <SectionsExample {...sectionsProps} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "nested",
            name: "A section inside a section",
            readout: () =>
                `outcome: ${nestedOutcome} — the payment section answers to the delivery section, which answers to the form, so the verdict travels up two levels rather than one`,
            component: () => (
                <NestedExample
                    streetState={streetState}
                    cardState={cardState}
                    onSubmit={() => {
                        setNestedOutcome("submitted");
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Nested.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
