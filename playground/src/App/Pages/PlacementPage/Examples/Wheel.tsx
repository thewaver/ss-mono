import { createSignal } from "solid-js";

import { Button, OverheadWheel, PlacementLayoutUtils } from "@thewaver/ss-components";
import type { WheelController } from "@thewaver/ss-components";

import {
    PageWheelCentre,
    PageWheelPip,
    PageWheelSpin,
    PageWheelStack,
    PageWheelWedge,
} from "../../../StyledComponents/WheelContent/WheelContent";
import type { PlacementExampleProps } from "../PlacementPage.types";

const PRIZES = ["Free spin", "Ten coins", "Nothing", "A hat", "Fifty coins", "A shrug"];

export const WheelExample = (props: PlacementExampleProps) => {
    const [getController, setController] = createSignal<WheelController>();

    return (
        <PageWheelStack>
            <OverheadWheel
                wedges={() => PRIZES}
                ariaLabel={"Prize wheel"}
                computeLayout={(defs) => PlacementLayoutUtils.createRing(props.getLayoutDefs())(defs)}
                computeSpinTarget={() => Math.floor(Math.random() * PRIZES.length)}
                computeWedgeLabel={(index) => `${PRIZES[index]}, ${index + 1} of ${PRIZES.length}`}
                renderWedge={(getWedge, getState) => <PageWheelWedge state={getState}>{getWedge()}</PageWheelWedge>}
                onMount={setController}
            />

            <PageWheelPip side={"top"} />

            <PageWheelCentre>
                <Button
                    ariaLabel={"Spin the wheel"}
                    isDisabled={() => !getController()?.getIsSpinnable()}
                    renderContent={(getFlags) => (
                        <PageWheelSpin flags={getFlags} phase={() => getController()?.getPhase()} />
                    )}
                    onClick={() => getController()?.spin()}
                />
            </PageWheelCentre>
        </PageWheelStack>
    );
};
