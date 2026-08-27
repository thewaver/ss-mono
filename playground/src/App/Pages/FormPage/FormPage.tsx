import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { SectionsExample } from "./Examples/Sections";
import { SignUpExample } from "./Examples/SignUp";
import type { FormExampleProps, FormSectionsExampleProps } from "./FormPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormPage/Examples";

export const FormPage = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const termsSignal = createSignal(false);

    const sectionsEmailSignal = createSignal("");
    const sectionsPasswordSignal = createSignal("");
    const sectionsConfirmSignal = createSignal("");

    const [getOutcome, setOutcome] = createSignal("not submitted");
    const [getSectionsOutcome, setSectionsOutcome] = createSignal("not submitted");

    const getExamples = createMemo(() => {
        const commonProps: FormExampleProps = {
            emailSignal,
            passwordSignal,
            termsSignal,
            onSubmit: () => {
                setOutcome(`submitted as ${emailSignal[0]()}`);
            },
            onReset: () => {
                setOutcome("not submitted");
            },
        };

        const sectionsProps: FormSectionsExampleProps = {
            emailSignal: sectionsEmailSignal,
            passwordSignal: sectionsPasswordSignal,
            confirmSignal: sectionsConfirmSignal,
            onSubmit: () => {
                setSectionsOutcome(`submitted as ${sectionsEmailSignal[0]()}`);
            },
            onReset: () => {
                setSectionsOutcome("not submitted");
            },
        };

        return [
            {
                key: "reportsValidity",
                name: "A form that reports its own validity",
                readout: () => `outcome: ${getOutcome()}`,
                component: () => <SignUpExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/SignUp.tsx`,
            },
            {
                key: "sections",
                name: "Sections with their own validity",
                readout: () => `outcome: ${getSectionsOutcome()}`,
                component: () => <SectionsExample {...sectionsProps} />,
                path: `${EXAMPLES_ROOT}/Sections.tsx`,
            },
        ];
    });

    return <PageExamples items={getExamples} />;
};
