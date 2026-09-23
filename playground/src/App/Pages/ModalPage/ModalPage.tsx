import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DestructiveConfirmationExample } from "./Examples/DestructiveConfirmation";
import { LayeredExample } from "./Examples/Layered";
import { TextOnlyExample } from "./Examples/TextOnly";

const EXAMPLES_ROOT = "/src/App/Pages/ModalPage/Examples";

export const ModalPage = () => {
    const modalVisibility = createSignal(false);
    const destructiveVisibility = createSignal(false);
    const layeredVisibility = createSignal(false);
    const layeredSignal = createSignal<string | undefined>();
    const textOnlyVisibility = createSignal(false);

    const [getOutcome, setOutcome] = createSignal("nothing decided yet");

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `open: ${modalVisibility[0]()} — Escape and an overlay click both dismiss it`,
            component: () => <DefaultExample visibilitySignal={modalVisibility} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "destructiveConfirmation",
            name: "Destructive confirmation",
            readout: () =>
                `open: ${destructiveVisibility[0]()} | outcome: ${getOutcome()} — the alertdialog role, a required focus target, and neither overlay nor Escape dismissal`,
            component: () => (
                <DestructiveConfirmationExample visibilitySignal={destructiveVisibility} onDecide={setOutcome} />
            ),
            path: `${EXAMPLES_ROOT}/DestructiveConfirmation.tsx`,
        },
        {
            key: "layered",
            name: "A popup inside it",
            readout: () =>
                `open: ${layeredVisibility[0]()} | country: ${layeredSignal[0]() ?? "undefined"} — Escape closes the innermost layer only`,
            component: () => <LayeredExample visibilitySignal={layeredVisibility} valueSignal={layeredSignal} />,
            path: `${EXAMPLES_ROOT}/Layered.tsx`,
        },
        {
            key: "textOnly",
            name: "Nothing focusable inside",
            readout: () =>
                `open: ${textOnlyVisibility[0]()} — with nothing to focus inside, the dialog takes focus itself`,
            component: () => <TextOnlyExample visibilitySignal={textOnlyVisibility} />,
            path: `${EXAMPLES_ROOT}/TextOnly.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
