import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import {
    FIELD_WIDTH,
    GAP_STEP,
    ITEM_COUNT_STEP,
    MAX_GAP,
    MAX_ITEM_COUNT,
    MIN_GAP,
    MIN_ITEM_COUNT,
    SIZE_ANCHORS,
} from "./Mosaics.const";
import type { MosaicsControls } from "./Mosaics.types";

type Props = {
    controls: MosaicsControls;
};

export const PageMosaicsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp key={"itemCount"} label={"Items"}>
                <PageNumberField
                    value={controls.itemCountSignal[0]}
                    min={() => MIN_ITEM_COUNT}
                    max={() => MAX_ITEM_COUNT}
                    step={() => ITEM_COUNT_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Items"}
                    onInput={controls.itemCountSignal[1]}
                />
            </PageProp>

            <PageProp key={"gap"} label={"Gap (px)"}>
                <PageNumberField
                    value={controls.gapSignal[0]}
                    min={() => MIN_GAP}
                    max={() => MAX_GAP}
                    step={() => GAP_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Gap in pixels"}
                    onInput={controls.gapSignal[1]}
                />
            </PageProp>

            <PageProp key={"sizeAnchor"} label={"Fixed side"}>
                <PageSelectField
                    value={controls.sizeAnchorSignal[0]}
                    values={() => SIZE_ANCHORS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Fixed side"}
                    onChange={(anchor) => controls.sizeAnchorSignal[1](() => anchor)}
                />
            </PageProp>
        </PagePropsPanel>
    );
};
