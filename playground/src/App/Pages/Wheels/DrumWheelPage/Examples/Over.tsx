import { createSignal } from "solid-js";

import { Button, DrumWheel, access } from "@thewaver/ss-components";
import type { WheelController } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageWheelBar,
    PageWheelCard,
    PageWheelMount,
    PageWheelPip,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import { pickPrizeIndex } from "../../Wheels.const";
import type { WheelExampleProps } from "../../Wheels.types";

const WEDGE_SIZE: Size2d = { width: 160, height: 64 };

type Props = WheelExampleProps;

export const OverExample = ({ wedges, ...otherProps }: Props) => {
    const getWedges = () => access(wedges);

    const [getController, setController] = createSignal<WheelController>();

    return (
        <>
            <PageWheelMount>
                <DrumWheel
                    {...otherProps}
                    wedges={getWedges}
                    axis={"column"}
                    wedgeSize={() => WEDGE_SIZE}
                    ariaLabel={"Prize drum, turning over"}
                    computeSpinTarget={() => pickPrizeIndex(getWedges().length)}
                    computeWedgeLabel={(index) => `${getWedges()[index]}, ${index + 1} of ${getWedges().length}`}
                    renderWedge={(getWedge, getState) => <PageWheelCard state={getState}>{getWedge()}</PageWheelCard>}
                    renderWedgeBack={(_getWedge, getState) => <PageWheelCard state={getState} />}
                    onMount={setController}
                />

                <PageWheelPip side={"left"} />
            </PageWheelMount>

            <PageWheelBar>
                <Button
                    id={"reelSpin"}
                    ariaLabel={"Spin the wheel"}
                    isDisabled={() => !getController()?.getIsSpinnable()}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Spin</PageButtonContent>}
                    onClick={() => getController()?.spin()}
                />
            </PageWheelBar>
        </>
    );
};
