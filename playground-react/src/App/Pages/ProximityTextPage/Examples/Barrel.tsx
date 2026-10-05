import { useRef } from "react";

import { ElementObserverReactUtils, ProximityText } from "@thewaver/ss-components-react";
import type { PointSource } from "@thewaver/ss-components-react";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageReact.types";

const TEXT =
    "The universe keeps on expanding, stretching space in every direction with a quiet and steady motion. Galaxies drift apart across distances too large to picture, carried by a flow that began in the first instant. What was once one dense and burning point has opened into a wide and growing expanse, and every line here closes up as it reaches the middle and spreads out again past it, as though read from inside a turning barrel.";
const MIDDLE = 0.5;
const NO_HEIGHT = 0;

type Props = Pick<ProximityTextExampleProps, "isDisabled">;

export const BarrelExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    ElementObserverReactUtils.useScrollContainerProgress(textRef, boxRef);

    const computePointSource = (): PointSource => {
        const box = boxRef.current;
        const text = textRef.current;

        if (!box || !text || text.offsetHeight <= NO_HEIGHT) return { ratio: undefined };

        const middle = box.scrollTop + box.clientHeight * MIDDLE - text.offsetTop;

        return { ratio: { x: MIDDLE, y: middle / text.offsetHeight } };
    };

    return (
        <div ref={boxRef} id={"barrelScrollBox"} className={styles.barrelBox}>
            <div ref={textRef} className={styles.barrelText}>
                <ProximityText
                    computeAnimationName={() => styles.barrelSpacing}
                    reachPx={ProximityTextKnobs.BARREL_REACH_PX}
                    distanceAxis={"vertical"}
                    isDisabled={props.isDisabled}
                    pointSource={computePointSource()}
                >
                    {TEXT}
                </ProximityText>
            </div>
        </div>
    );
};
