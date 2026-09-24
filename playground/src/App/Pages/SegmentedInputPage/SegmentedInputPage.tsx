import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { OneTimeCodeExample } from "./Examples/OneTimeCode";
import { RecoveryCodeExample } from "./Examples/RecoveryCode";
import { ONE_TIME_CODE_LENGTH, RECOVERY_CODE_LENGTH } from "./SegmentedInputPage.const";

const EXAMPLES_ROOT = "/src/App/Pages/SegmentedInputPage/Examples";

export const SegmentedInputPage = () => {
    const oneTimeCodeSignal = createSignal("");
    const recoveryCodeSignal = createSignal("");

    const getExamples = createMemo(() => [
        {
            key: "oneTimeCode",
            name: "One-time code",
            readout: () =>
                `value: "${oneTimeCodeSignal[0]()}" — ${ONE_TIME_CODE_LENGTH} digits in one field; press a cell to put the caret there`,
            component: () => <OneTimeCodeExample valueSignal={oneTimeCodeSignal} />,
            path: `${EXAMPLES_ROOT}/OneTimeCode.tsx`,
        },
        {
            key: "recoveryCode",
            name: "Letters and digits",
            readout: () =>
                `value: "${recoveryCodeSignal[0]()}" — ${RECOVERY_CODE_LENGTH} cells taking letters and digits, anything else refused`,
            component: () => <RecoveryCodeExample valueSignal={recoveryCodeSignal} />,
            path: `${EXAMPLES_ROOT}/RecoveryCode.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
