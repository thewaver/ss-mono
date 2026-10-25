import { createSignal } from "solid-js";

import { PlacementLayoutDefaults } from "@thewaver/ss-components-solid";
import { WheelMenuKnobs } from "@thewaver/ss-playground/App/Knobs/WheelMenus.const";
import {
    BAND_WIDTH,
    DOCS_ROOT,
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
                        <PageProp
                            key={"spreadDegrees"}
                            label={"Spread (°)"}
                            hint={
                                "How much of the circle the wedges are spread over: 360 for a whole wheel, 180 for half of one."
                            }
                            controls={"Sets WheelMenuProps.spreadDegrees"}
                        >
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

                        <PageProp
                            key={"holeRadius"}
                            label={"Hole radius (px)"}
                            hint={"How much of the middle is left empty, which is where the close control sits."}
                            controls={"Sets WheelMenuProps.holeRadius"}
                        >
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

                        <PageProp
                            key={"bandWidth"}
                            label={"Band width (px)"}
                            hint={"How thick the band of wedges is."}
                            controls={"Sets WheelMenuProps.bandWidth"}
                        >
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

                        <PageProp
                            key={"wedgeGapDegrees"}
                            label={"Wedge gap (°)"}
                            hint={"The space left between one wedge and the next."}
                            controls={"Sets WheelMenuProps.layoutDefs.wedgeGapDegrees"}
                        >
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

            <PageDocsSection
                title={"Submenus as bands"}
                content={
                    "Give an item [prop]items[/prop] of its own and its submenu opens as a band round the same center, outside the one that opened it and [prop]levelGap[/prop] away from it. The band is aimed at the wedge that opened it and is only as wide as its own items need, so a short submenu stays short however far out it sits. Over less than a whole turn, a band is shifted to stay inside the spread."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bands.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"bandsSpreadDegrees"}
                        label={"Spread (°)"}
                        hint={"How much of the circle the wedges are spread over. Every band stays inside it."}
                        controls={"Sets WheelMenuProps.spreadDegrees"}
                    >
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

            <PageDocsSection
                title={"A wedge that asks for room"}
                content={
                    "An item may ask for its own share of the turn with [prop]arcDegrees[/prop], and the items that do not ask share what is left. The wedges follow one another from the same start, so two can never overlap. Here Confirm asks for half the turn."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Weighted.tsx`}>
                <WeightedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Hold and flick"}
                content={
                    "With [prop]opensOnHold[/prop] on, pressing the button and holding it down opens the wheel. Move a short way toward a wedge and let go to pick it; come back to the middle before letting go to pick nothing. A plain click still opens the wheel and leaves it open, to be picked from by clicking or with the keyboard."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Flick.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"opensOnHold"}
                        label={"Opens on hold"}
                        hint={
                            "Whether holding the button down opens the wheel, so a flick toward a wedge picks it on release."
                        }
                        controls={"Sets WheelMenuProps.opensOnHold"}
                    >
                        <PageCheckField value={getOpensOnHold} ariaLabel={"Opens on hold"} onChange={setOpensOnHold} />
                    </PageProp>
                )}
            >
                <FlickDocsExample opensOnHold={getOpensOnHold} />
            </PageDocsExample>
        </>
    );
};
