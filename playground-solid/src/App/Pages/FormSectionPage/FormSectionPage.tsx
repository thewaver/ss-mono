import { createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { NestedExample } from "./Examples/Nested";
import { SectionsExample } from "./Examples/Sections";
import type { FormSectionsExampleProps } from "./FormSectionPage.types";

export const FormSectionPage = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const confirmSignal = createSignal("");

    const streetSignal = createSignal("");
    const cardSignal = createSignal("");

    const [getOutcome, setOutcome] = createSignal("not submitted");
    const [getNestedOutcome, setNestedOutcome] = createSignal("not submitted");

    const getExamples = createMemo(() => {
        const sectionsProps: FormSectionsExampleProps = {
            email: emailSignal,
            password: passwordSignal,
            confirm: confirmSignal,
            onSubmit: () => {
                setOutcome(`submitted as ${emailSignal[0]()}`);
            },
            onReset: () => {
                setOutcome("not submitted");
            },
        };

        return [
            {
                key: "sections",
                name: EXAMPLE_NAMES.sections,
                readout: () =>
                    `outcome: ${getOutcome()} — each field reports to its own section, and the form hears one answer per section rather than one per field`,
                component: () => <SectionsExample {...sectionsProps} />,
                path: `${EXAMPLES_ROOT}/Sections.tsx`,
            },
            {
                key: "nested",
                name: EXAMPLE_NAMES.nested,
                readout: () =>
                    `outcome: ${getNestedOutcome()} — the payment section answers to the delivery section, which answers to the form, so the verdict travels up two levels rather than one`,
                component: () => (
                    <NestedExample
                        street={streetSignal}
                        card={cardSignal}
                        onSubmit={() => {
                            setNestedOutcome("submitted");
                        }}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Nested.tsx`,
            },
        ];
    });

    return <PageExamples items={getExamples} />;
};
