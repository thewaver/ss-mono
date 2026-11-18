import { createSignal } from "solid-js";

import { PlacementLayoutDefaults } from "@thewaver/ss-components-solid";
import { WheelMenuKnobs } from "@thewaver/ss-playground/App/Knobs/WheelMenus.const";
import {
    BAND_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
    HOLE_RADIUS,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BandsDocsExample } from "./Docs/Bands";
import { BasicDocsExample } from "./Docs/Basic";
import { FlickDocsExample } from "./Docs/Flick";
import { WeightedDocsExample } from "./Docs/Weighted";

export const WheelMenuDocs = () => {
    const [getSpreadDegrees, setSpreadDegrees] = createSignal(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
    const [getHoleRadius, setHoleRadius] = createSignal(HOLE_RADIUS);
    const [getBandWidth, setBandWidth] = createSignal(BAND_WIDTH);
    const [getWedgeGapDegrees, setWedgeGapDegrees] = createSignal(
        PlacementLayoutDefaults.BAND_DEFAULTS.wedgeGapDegrees,
    );
    const [getBandsSpreadDegrees, setBandsSpreadDegrees] = createSignal(
        PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees,
    );
    const [getOpensOnHold, setOpensOnHold] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"spreadDegrees"} {...WheelMenuKnobs.SPREAD_DEGREES_TEXT}>
                            <PageNumberField
                                value={getSpreadDegrees}
                                min={WheelMenuKnobs.MIN_SPREAD_DEGREES}
                                max={WheelMenuKnobs.MAX_SPREAD_DEGREES}
                                step={WheelMenuKnobs.SPREAD_STEP_DEGREES}
                                width={FIELD_WIDTH}
                                ariaLabel={"Spread in degrees"}
                                onInput={setSpreadDegrees}
                            />
                        </PageProp>

                        <PageProp key={"holeRadius"} {...WheelMenuKnobs.HOLE_RADIUS_TEXT}>
                            <PageNumberField
                                value={getHoleRadius}
                                min={WheelMenuKnobs.MIN_HOLE_RADIUS}
                                max={WheelMenuKnobs.MAX_HOLE_RADIUS}
                                step={WheelMenuKnobs.HOLE_RADIUS_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hole radius in pixels"}
                                onInput={setHoleRadius}
                            />
                        </PageProp>

                        <PageProp key={"bandWidth"} {...WheelMenuKnobs.BAND_WIDTH_TEXT}>
                            <PageNumberField
                                value={getBandWidth}
                                min={WheelMenuKnobs.MIN_BAND_WIDTH}
                                max={WheelMenuKnobs.MAX_BAND_WIDTH}
                                step={WheelMenuKnobs.BAND_WIDTH_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Band width in pixels"}
                                onInput={setBandWidth}
                            />
                        </PageProp>

                        <PageProp key={"wedgeGapDegrees"} {...WheelMenuKnobs.WEDGE_GAP_DEGREES_TEXT}>
                            <PageNumberField
                                value={getWedgeGapDegrees}
                                min={WheelMenuKnobs.MIN_WEDGE_GAP_DEGREES}
                                max={WheelMenuKnobs.MAX_WEDGE_GAP_DEGREES}
                                step={WheelMenuKnobs.WEDGE_GAP_STEP_DEGREES}
                                width={FIELD_WIDTH}
                                ariaLabel={"Wedge gap in degrees"}
                                onInput={setWedgeGapDegrees}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    spreadDegrees={getSpreadDegrees}
                    holeRadius={getHoleRadius}
                    bandWidth={getBandWidth}
                    wedgeGapDegrees={getWedgeGapDegrees}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.submenusBands} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bands.tsx`}
                renderKnobs={() => (
                    <PageProp key={"bandsSpreadDegrees"} {...WheelMenuKnobs.BANDS_SPREAD_DEGREES_TEXT}>
                        <PageNumberField
                            value={getBandsSpreadDegrees}
                            min={WheelMenuKnobs.MIN_SPREAD_DEGREES}
                            max={WheelMenuKnobs.MAX_SPREAD_DEGREES}
                            step={WheelMenuKnobs.SPREAD_STEP_DEGREES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Spread in degrees"}
                            onInput={setBandsSpreadDegrees}
                        />
                    </PageProp>
                )}
            >
                <BandsDocsExample spreadDegrees={getBandsSpreadDegrees} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.wedgeAskingForRoom} />

            <PageDocsExample path={`${DOCS_ROOT}/Weighted.tsx`}>
                <WeightedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.holdFlick} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Flick.tsx`}
                renderKnobs={() => (
                    <PageProp key={"opensOnHold"} {...WheelMenuKnobs.OPENS_ON_HOLD_TEXT}>
                        <PageCheckField value={getOpensOnHold} ariaLabel={"Opens on hold"} onChange={setOpensOnHold} />
                    </PageProp>
                )}
            >
                <FlickDocsExample opensOnHold={getOpensOnHold} />
            </PageDocsExample>
        </>
    );
};
