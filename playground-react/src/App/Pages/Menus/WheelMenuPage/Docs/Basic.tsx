import { useId, useState } from "react";

import { WheelMenu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    LAYOUT_SIZE,
    LEVEL_GAP,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    ACTIONS,
    CLOSER_DEFS,
    PageWheelGradientDefs,
    createWheelItemRenderer,
    renderWheelPopup,
} from "../WheelMenuPageReact.const";
import type { WheelMenuBasicDocsExampleProps } from "../WheelMenuPageReact.types";

type Props = WheelMenuBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const gradientId = useId();

    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div className={styles.stage}>
                <PageWheelGradientDefs gradientId={gradientId} />

                <WheelMenu
                    layoutSize={LAYOUT_SIZE}
                    items={ACTIONS}
                    ariaLabel={"Edit actions"}
                    spreadDegrees={props.spreadDegrees}
                    holeRadius={props.holeRadius}
                    bandWidth={props.bandWidth}
                    layoutDefs={{ wedgeGapDegrees: props.wedgeGapDegrees }}
                    levelGap={LEVEL_GAP}
                    placement={{ x: "center", y: "center" }}
                    closerDefs={CLOSER_DEFS}
                    renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Wheel</PageMenuTriggerContent>}
                    renderItem={createWheelItemRenderer(gradientId)}
                    renderPopup={renderWheelPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
