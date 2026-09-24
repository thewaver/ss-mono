import { MOSAIC_SIZE_ANCHORS } from "@thewaver/ss-components";

import { MosaicKnobs } from "../../Knobs/Mosaics.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { FIELD_WIDTH } from "./Mosaics.const";
import type { MosaicsControls } from "./Mosaics.types";

type Props = {
    controls: MosaicsControls;
};

export const PageMosaicsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp
                key={"itemCount"}
                label={"Items"}
                hint={
                    "How many tiles the mosaic packs. The arrangement is recomputed from scratch each time it changes."
                }
            >
                <PageNumberField
                    value={controls.itemCountSignal[0]}
                    min={() => MosaicKnobs.MIN_ITEM_COUNT}
                    max={() => MosaicKnobs.MAX_ITEM_COUNT}
                    step={() => MosaicKnobs.ITEM_COUNT_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Items"}
                    onInput={controls.itemCountSignal[1]}
                />
            </PageProp>

            <PageProp key={"gap"} label={"Gap (px)"} hint={"The space left between tiles."}>
                <PageNumberField
                    value={controls.gapSignal[0]}
                    min={() => MosaicKnobs.MIN_GAP}
                    max={() => MosaicKnobs.MAX_GAP}
                    step={() => MosaicKnobs.GAP_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Gap in pixels"}
                    onInput={controls.gapSignal[1]}
                />
            </PageProp>

            <PageProp
                key={"sizeAnchor"}
                label={"Fixed side"}
                hint={"Which side the mosaic takes as given: it fills that one and works the other out from the tiles."}
            >
                <PageSelectField
                    value={controls.sizeAnchorSignal[0]}
                    values={() => MOSAIC_SIZE_ANCHORS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Fixed side"}
                    onChange={(anchor) => controls.sizeAnchorSignal[1](() => anchor)}
                />
            </PageProp>

            <PageProp
                key={"transitionDurationMs"}
                label={"Glide (ms)"}
                hint={
                    "How long a tile takes to glide to its new place when tiles are added, taken out or resized. Resizing the mosaic itself never glides. At 0 tiles move at once, and under reduced motion they always do."
                }
            >
                <PageNumberField
                    value={controls.transitionDurationMsSignal[0]}
                    min={() => MosaicKnobs.MIN_DURATION_MS}
                    max={() => MosaicKnobs.MAX_DURATION_MS}
                    step={() => MosaicKnobs.DURATION_STEP_MS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Glide duration in milliseconds"}
                    onInput={controls.transitionDurationMsSignal[1]}
                />
            </PageProp>
        </PagePropsPanel>
    );
};
