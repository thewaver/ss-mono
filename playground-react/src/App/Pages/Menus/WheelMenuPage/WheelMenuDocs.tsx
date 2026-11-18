import { useState } from "react";

import { PlacementLayoutDefaults } from "@thewaver/ss-components-react";
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
    const [spreadDegrees, setSpreadDegrees] = useState(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
    const [holeRadius, setHoleRadius] = useState(HOLE_RADIUS);
    const [bandWidth, setBandWidth] = useState(BAND_WIDTH);
    const [wedgeGapDegrees, setWedgeGapDegrees] = useState(PlacementLayoutDefaults.BAND_DEFAULTS.wedgeGapDegrees);
    const [bandsSpreadDegrees, setBandsSpreadDegrees] = useState(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
    const [opensOnHold, setOpensOnHold] = useState(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"spreadDegrees"} {...WheelMenuKnobs.SPREAD_DEGREES_TEXT}>
                            <PageNumberField
                                value={spreadDegrees}
                                min={WheelMenuKnobs.MIN_SPREAD_DEGREES}
                                max={WheelMenuKnobs.MAX_SPREAD_DEGREES}
                                step={WheelMenuKnobs.SPREAD_STEP_DEGREES}
                                width={FIELD_WIDTH}
                                ariaLabel={"Spread in degrees"}
                                onInput={setSpreadDegrees}
                            />
                        </PageProp>

                        <PageProp itemKey={"holeRadius"} {...WheelMenuKnobs.HOLE_RADIUS_TEXT}>
                            <PageNumberField
                                value={holeRadius}
                                min={WheelMenuKnobs.MIN_HOLE_RADIUS}
                                max={WheelMenuKnobs.MAX_HOLE_RADIUS}
                                step={WheelMenuKnobs.HOLE_RADIUS_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hole radius in pixels"}
                                onInput={setHoleRadius}
                            />
                        </PageProp>

                        <PageProp itemKey={"bandWidth"} {...WheelMenuKnobs.BAND_WIDTH_TEXT}>
                            <PageNumberField
                                value={bandWidth}
                                min={WheelMenuKnobs.MIN_BAND_WIDTH}
                                max={WheelMenuKnobs.MAX_BAND_WIDTH}
                                step={WheelMenuKnobs.BAND_WIDTH_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Band width in pixels"}
                                onInput={setBandWidth}
                            />
                        </PageProp>

                        <PageProp itemKey={"wedgeGapDegrees"} {...WheelMenuKnobs.WEDGE_GAP_DEGREES_TEXT}>
                            <PageNumberField
                                value={wedgeGapDegrees}
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
                    spreadDegrees={spreadDegrees}
                    holeRadius={holeRadius}
                    bandWidth={bandWidth}
                    wedgeGapDegrees={wedgeGapDegrees}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.submenusBands} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bands.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"bandsSpreadDegrees"} {...WheelMenuKnobs.BANDS_SPREAD_DEGREES_TEXT}>
                        <PageNumberField
                            value={bandsSpreadDegrees}
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
                <BandsDocsExample spreadDegrees={bandsSpreadDegrees} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.wedgeAskingForRoom} />

            <PageDocsExample path={`${DOCS_ROOT}/Weighted.tsx`}>
                <WeightedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.holdFlick} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Flick.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"opensOnHold"} {...WheelMenuKnobs.OPENS_ON_HOLD_TEXT}>
                        <PageCheckField value={opensOnHold} ariaLabel={"Opens on hold"} onChange={setOpensOnHold} />
                    </PageProp>
                )}
            >
                <FlickDocsExample opensOnHold={opensOnHold} />
            </PageDocsExample>
        </>
    );
};
