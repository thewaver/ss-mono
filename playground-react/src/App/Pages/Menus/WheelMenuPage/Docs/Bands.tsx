import { useId, useState } from "react";

import { WheelMenu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BAND_WIDTH,
    HOLE_RADIUS,
    LAYOUT_SIZE,
    LEVEL_GAP,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    CLOSER_DEFS,
    NESTED_ACTIONS,
    PageWheelGradientDefs,
    createWheelItemRenderer,
    renderWheelPopup,
} from "../WheelMenuPageReact.const";
import type { WheelMenuBandsDocsExampleProps } from "../WheelMenuPageReact.types";

type Props = WheelMenuBandsDocsExampleProps;

export const BandsDocsExample = (props: Props) => {
    const gradientId = useId();

    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div className={styles.stage}>
                <PageWheelGradientDefs gradientId={gradientId} />

                <WheelMenu
                    layoutSize={LAYOUT_SIZE}
                    items={NESTED_ACTIONS}
                    ariaLabel={"Edit actions"}
                    spreadDegrees={props.spreadDegrees}
                    holeRadius={HOLE_RADIUS}
                    bandWidth={BAND_WIDTH}
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
