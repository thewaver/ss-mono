import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, ProximityText } from "@thewaver/ss-components-solid";
import type { PointSource } from "@thewaver/ss-components-solid";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import type { ProximityTextExampleProps } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.types";

const TEXT =
    "The universe keeps on expanding, stretching space in every direction with a quiet and steady motion. Galaxies drift apart across distances too large to picture, carried by a flow that began in the first instant. What was once one dense and burning point has opened into a wide and growing expanse, and every line here closes up as it reaches the middle and spreads out again past it, as though read from inside a turning barrel.";
const MIDDLE = 0.5;
const NO_HEIGHT = 0;

type Props = Pick<ProximityTextExampleProps, "isDisabled">;

export const BarrelExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getTextRef, setTextRef] = createSignal<HTMLElement>();

    const getTravel = ElementObserverSolidUtils.createScrollContainerProgressObserver(getTextRef, getBoxRef);

    const getPointSource = (): PointSource => {
        getTravel();

        const box = getBoxRef();
        const text = getTextRef();

        if (!box || !text || text.offsetHeight <= NO_HEIGHT) return { ratio: undefined };

        const middle = box.scrollTop + box.clientHeight * MIDDLE - text.offsetTop;

        return { ratio: { x: MIDDLE, y: middle / text.offsetHeight } };
    };

    return (
        <div ref={setBoxRef} id={"barrelScrollBox"} class={styles.barrelBox}>
            <div ref={setTextRef} class={styles.barrelText}>
                <ProximityText
                    computeAnimationName={() => styles.barrelSpacing}
                    reachPx={() => ProximityTextKnobs.BARREL_REACH_PX}
                    distanceAxis={() => "vertical"}
                    isDisabled={props.isDisabled}
                    pointSource={getPointSource}
                >
                    {TEXT}
                </ProximityText>
            </div>
        </div>
    );
};
