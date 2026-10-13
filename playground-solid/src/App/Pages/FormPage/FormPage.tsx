import { createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { FocusOnErrorExample } from "./Examples/FocusOnError";
import { SignUpExample } from "./Examples/SignUp";
import type { FormExampleProps } from "./FormPage.types";

export const FormPage = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const termsSignal = createSignal(false);

    const [getOutcome, setOutcome] = createSignal("not submitted");

    const planSignal = createSignal<string | undefined>();
    const topicsSignal = createSignal<string[]>([]);

    const [getFocusOutcome, setFocusOutcome] = createSignal("not submitted");

    const getExamples = createMemo(() => {
        const commonProps: FormExampleProps = {
            email: emailSignal,
            password: passwordSignal,
            terms: termsSignal,
            onSubmit: () => {
                setOutcome(`submitted as ${emailSignal[0]()}`);
            },
            onReset: () => {
                setOutcome("not submitted");
            },
        };

        return [
            {
                key: "reportsValidity",
                name: EXAMPLE_NAMES.reportsValidity,
                readout: () => `outcome: ${getOutcome()}`,
                component: () => <SignUpExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/SignUp.tsx`,
            },
            {
                key: "focusOnError",
                name: EXAMPLE_NAMES.focusOnError,
                readout: () =>
                    `outcome: ${getFocusOutcome()} — the handler runs either way, and afterwards focus lands on the first field reporting an error`,
                component: () => (
                    <FocusOnErrorExample
                        plan={planSignal}
                        topics={topicsSignal}
                        onSubmit={() => {
                            setFocusOutcome(
                                `submitted as ${planSignal[0]() ?? "no plan"}, [${topicsSignal[0]().join(", ")}]`,
                            );
                        }}
                        onReset={() => {
                            planSignal[1](undefined);
                            topicsSignal[1]([]);
                            setFocusOutcome("not submitted");
                        }}
                    />
                ),
                path: `${EXAMPLES_ROOT}/FocusOnError.tsx`,
            },
        ];
    });

    return <PageExamples items={getExamples} />;
};
