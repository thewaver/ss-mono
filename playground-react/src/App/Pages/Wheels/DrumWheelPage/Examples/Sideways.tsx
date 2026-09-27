import { useState, useSyncExternalStore } from "react";

import { Button, DrumWheel } from "@thewaver/ss-components-react";
import type { WheelController } from "@thewaver/ss-components-react";
import { pickPrizeIndex } from "@thewaver/ss-playground-core/App/Pages/Wheels/Wheels.const";
import type { Size2d } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageWheelBar,
    PageWheelCard,
    PageWheelMount,
    PageWheelPip,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import type { WheelExampleProps } from "../../Wheels.types";

const WEDGE_SIZE: Size2d = { width: 160, height: 64 };
const NO_SUBSCRIPTION = () => () => {};

type Props = WheelExampleProps;

export const SidewaysExample = ({ wedges, ...otherProps }: Props) => {
    const [controller, setController] = useState<WheelController>();

    const isSpinnable = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsSpinnable() ?? false,
    );

    return (
        <>
            <PageMeasureBox>
                <PageWheelMount>
                    <DrumWheel
                        {...otherProps}
                        wedges={wedges}
                        axis={"row"}
                        wedgeSize={WEDGE_SIZE}
                        ariaLabel={"Prize drum, turning sideways"}
                        computeSpinTarget={() => pickPrizeIndex(wedges.length)}
                        computeWedgeLabel={(index) => `${wedges[index]}, ${index + 1} of ${wedges.length}`}
                        renderWedge={(wedge, state) => <PageWheelCard state={state}>{wedge}</PageWheelCard>}
                        renderWedgeBack={(_wedge, state) => <PageWheelCard state={state} />}
                        onMount={setController}
                    />

                    <PageWheelPip side={"top"} />
                </PageWheelMount>
            </PageMeasureBox>

            <PageWheelBar>
                <Button
                    id={"sidewaysSpin"}
                    ariaLabel={"Spin the wheel"}
                    isDisabled={!isSpinnable}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Spin</PageButtonContent>}
                    onClick={() => {
                        controller?.spin();
                    }}
                />
            </PageWheelBar>
        </>
    );
};
