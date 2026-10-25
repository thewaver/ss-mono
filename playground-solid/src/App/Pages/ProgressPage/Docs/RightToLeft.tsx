import { Progress } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.css";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.4;

export const RightToLeftDocsExample = () => (
    <div dir={"rtl"} class={styles.docsDirectionBox}>
        <Progress
            value={RATIO}
            ariaLabel={"Setup progress"}
            renderContent={(getState) => <PageProgressContent state={getState} />}
        />
    </div>
);
