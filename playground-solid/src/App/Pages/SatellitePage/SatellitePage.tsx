import { createMemo, createSignal } from "solid-js";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SATELLITE_DEFAULTS } from "@thewaver/ss-components-solid";
import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-solid";
import { SatelliteKnobs } from "@thewaver/ss-playground/App/Knobs/Satellites.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SatellitePage/SatellitePage.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BadgeExample } from "./Examples/Badge";
import { DefaultExample } from "./Examples/Default";
import { SeveralExample } from "./Examples/Several";
import type { SatelliteBadgeCorner, SatelliteExampleProps } from "./SatellitePageSolid.types";

export const SatellitePage = () => {
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(SatelliteKnobs.STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(SatelliteKnobs.STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(SATELLITE_DEFAULTS.offset.x);
    const [getOffsetY, setOffsetY] = createSignal(SATELLITE_DEFAULTS.offset.y);
    const [getSubjectWidth, setSubjectWidth] = createSignal(SatelliteKnobs.STARTING_SUBJECT_WIDTH);
    const [getSubjectHeight, setSubjectHeight] = createSignal(SatelliteKnobs.STARTING_SUBJECT_HEIGHT);
    const [getBadgeSize, setBadgeSize] = createSignal(SatelliteKnobs.STARTING_BADGE_SIZE);
    const [getHasSatellite, setHasSatellite] = createSignal(SatelliteKnobs.STARTING_HAS_SATELLITE);
    const [getIsBehindSubject, setIsBehindSubject] = createSignal(SATELLITE_DEFAULTS.isBehindSubject);
    const [getCorner, setCorner] = createSignal<SatelliteBadgeCorner>(SatelliteKnobs.STARTING_CORNER);
    const [getCount, setCount] = createSignal(SatelliteKnobs.STARTING_COUNT);
    const [getOverhang, setOverhang] = createSignal(SatelliteKnobs.STARTING_OVERHANG);

    const getPlacement = createMemo(() => ({ x: getHPlacement(), y: getVPlacement() }));

    const getOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    const getCommonProps = (): SatelliteExampleProps => ({
        subjectWidth: getSubjectWidth,
        subjectHeight: getSubjectHeight,
    });

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => "one satellite, moved through every placement; the dashed box is what the pair takes up",
            component: () => (
                <>
                    <PageMeasureBox>
                        <DefaultExample
                            {...getCommonProps()}
                            placement={getPlacement}
                            offset={getOffset}
                            isBehindSubject={getIsBehindSubject}
                            badgeSize={getBadgeSize}
                            hasSatellite={getHasSatellite}
                        />
                    </PageMeasureBox>

                    <PageExampleKnobs>
                        <PageProp
                            key={"hPlacement"}
                            label={"Placement across"}
                            hint={
                                "Where the satellite sits across its subject: inside an edge, centered, or outside it altogether."
                            }
                            controls={"Sets SatelliteDefs.placement.x"}
                        >
                            <PageSelectField
                                value={getHPlacement}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={(placement) => setHPlacement(() => placement)}
                            />
                        </PageProp>

                        <PageProp
                            key={"vPlacement"}
                            label={"Placement down"}
                            hint={
                                "Where the satellite sits above or below its subject: inside an edge, centered, or outside it altogether."
                            }
                            controls={"Sets SatelliteDefs.placement.y"}
                        >
                            <PageSelectField
                                value={getVPlacement}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={(placement) => setVPlacement(() => placement)}
                            />
                        </PageProp>

                        <PageProp
                            key={"offsetX"}
                            label={"Offset across (px)"}
                            hint={"How far the satellite is nudged sideways from where the placement put it."}
                            controls={"Sets SatelliteDefs.offset.x"}
                        >
                            <PageNumberField
                                value={getOffsetX}
                                min={SatelliteKnobs.MIN_OFFSET}
                                max={SatelliteKnobs.MAX_OFFSET}
                                step={SatelliteKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp
                            key={"offsetY"}
                            label={"Offset down (px)"}
                            hint={"How far the satellite is nudged up or down from where the placement put it."}
                            controls={"Sets SatelliteDefs.offset.y"}
                        >
                            <PageNumberField
                                value={getOffsetY}
                                min={SatelliteKnobs.MIN_OFFSET}
                                max={SatelliteKnobs.MAX_OFFSET}
                                step={SatelliteKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset down"}
                                onInput={setOffsetY}
                            />
                        </PageProp>

                        <PageProp
                            key={"hasSatellite"}
                            label={"Render a satellite"}
                            hint={
                                "Whether a satellite is rendered at all, so the subject can be seen with and without one."
                            }
                            controls={"Switches SatelliteProps.satellites between one satellite and none"}
                        >
                            <PageCheckField
                                value={getHasSatellite}
                                ariaLabel={"Render a satellite"}
                                onChange={setHasSatellite}
                            />
                        </PageProp>

                        <PageProp
                            key={"badgeSize"}
                            label={"Satellite size (px)"}
                            hint={"How large the satellite itself is."}
                            controls={"Sets the size of the example badge drawn by SatelliteDefs.renderSatellite"}
                        >
                            <PageNumberField
                                value={getBadgeSize}
                                min={SatelliteKnobs.MIN_BADGE_SIZE}
                                max={SatelliteKnobs.MAX_BADGE_SIZE}
                                step={SatelliteKnobs.BADGE_SIZE_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Satellite size"}
                                onInput={setBadgeSize}
                            />
                        </PageProp>

                        <PageProp
                            key={"isBehindSubject"}
                            label={"Behind the subject"}
                            hint={
                                "Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps."
                            }
                            controls={"Sets SatelliteDefs.isBehindSubject"}
                        >
                            <PageCheckField
                                value={getIsBehindSubject}
                                ariaLabel={"Behind the subject"}
                                onChange={setIsBehindSubject}
                            />
                        </PageProp>
                    </PageExampleKnobs>
                </>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "several",
            name: EXAMPLE_NAMES.several,
            readout: () =>
                "a corner badge, one hanging off the left and one tucked behind the bottom edge — each side of the box grows by the furthest any of them reaches",
            component: () => (
                <PageMeasureBox>
                    <SeveralExample {...getCommonProps()} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Several.tsx`,
        },
        {
            key: "badge",
            name: EXAMPLE_NAMES.badge,
            readout: () =>
                "a count pinned inside a corner and pushed out past it by the same amount on both axes, so a longer number grows the badge inward and the overhang never changes",
            component: () => (
                <>
                    <PageMeasureBox>
                        <BadgeExample
                            {...getCommonProps()}
                            corner={getCorner}
                            count={getCount}
                            overhang={getOverhang}
                        />
                    </PageMeasureBox>

                    <PageExampleKnobs>
                        <PageProp
                            key={"badgeCorner"}
                            label={"Corner"}
                            hint={"Which corner the badge is pinned to; the overhang turns outward with it."}
                            controls={
                                "Picks the corner the example turns into SatelliteDefs.placement and SatelliteDefs.offset"
                            }
                        >
                            <PageSelectField
                                value={getCorner}
                                values={SatelliteKnobs.BADGE_CORNERS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Corner"}
                                onChange={(corner) => setCorner(() => corner)}
                            />
                        </PageProp>

                        <PageProp
                            key={"badgeCount"}
                            label={"Count"}
                            hint={"The number on the badge. More digits make it wider, and it grows toward the middle."}
                            controls={"Sets the number in the example pill drawn by SatelliteDefs.renderSatellite"}
                        >
                            <PageNumberField
                                value={getCount}
                                min={SatelliteKnobs.MIN_COUNT}
                                max={SatelliteKnobs.MAX_COUNT}
                                step={SatelliteKnobs.COUNT_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Count"}
                                onInput={setCount}
                            />
                        </PageProp>

                        <PageProp
                            key={"badgeOverhang"}
                            label={"Overhang (px)"}
                            hint={"How far the badge pokes out past each of the two edges it is pinned to."}
                            controls={"Sets how far the example pushes SatelliteDefs.offset out from the corner"}
                        >
                            <PageNumberField
                                value={getOverhang}
                                min={SatelliteKnobs.MIN_OVERHANG}
                                max={SatelliteKnobs.MAX_OVERHANG}
                                step={SatelliteKnobs.OVERHANG_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Overhang"}
                                onInput={setOverhang}
                            />
                        </PageProp>
                    </PageExampleKnobs>
                </>
            ),
            path: `${EXAMPLES_ROOT}/Badge.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"subjectWidth"}
                    label={"Subject width (px)"}
                    hint={"How wide the thing the satellite is pinned to is."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={getSubjectWidth}
                        min={SatelliteKnobs.MIN_SUBJECT_SIZE}
                        max={SatelliteKnobs.MAX_SUBJECT_SIZE}
                        step={SatelliteKnobs.SUBJECT_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Subject width"}
                        onInput={setSubjectWidth}
                    />
                </PageProp>

                <PageProp
                    key={"subjectHeight"}
                    label={"Subject height (px)"}
                    hint={"How tall the thing the satellite is pinned to is."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={getSubjectHeight}
                        min={SatelliteKnobs.MIN_SUBJECT_SIZE}
                        max={SatelliteKnobs.MAX_SUBJECT_SIZE}
                        step={SatelliteKnobs.SUBJECT_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Subject height"}
                        onInput={setSubjectHeight}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
