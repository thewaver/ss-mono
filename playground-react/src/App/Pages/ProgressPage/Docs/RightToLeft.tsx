import { Progress } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.css";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.4;

export const RightToLeftDocsExample = () => (
    <div dir={"rtl"} className={styles.docsDirectionBox}>
        <Progress
            value={RATIO}
            ariaLabel={"Setup progress"}
            renderContent={(state) => <PageProgressContent state={state} />}
        />
    </div>
);
