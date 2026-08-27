import { createMemo, createSignal } from "solid-js";

import type { PointerReading } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { CardGlowExample } from "./Examples/CardGlow";
import { CastShadowExample } from "./Examples/CastShadow";
import { CompassExample } from "./Examples/Compass";
import { LampsExample } from "./Examples/Lamps";
import { MagnetExample } from "./Examples/Magnet";
import { TiltExample } from "./Examples/Tilt";

const EXAMPLES_ROOT = "/src/App/Pages/PointerTrackerPage/Examples";
const WHOLE_DIGITS = 0;
const RATIO_DIGITS = 2;
const WIDE_SPAN = 2;
const BOX_WIDTH = 300;
const BOX_PADDING = 10;
const COMPASS_HEIGHT = 180;
const MAGNET_HEIGHT = 160;
const TILT_HEIGHT = 200;

export const PointerTrackerPage = () => {
    const [getShadowReading, setShadowReading] = createSignal<PointerReading>();
    const [getCompassReading, setCompassReading] = createSignal<PointerReading>();

    const describe = (reading: PointerReading | undefined) => {
        if (!reading) return "no reading yet";

        return `angle: ${reading.angle.toFixed(WHOLE_DIGITS)}° — distance: ${reading.distance.toFixed(WHOLE_DIGITS)}px — edge: ${reading.edgeDistance.toFixed(WHOLE_DIGITS)}px — ratio: ${reading.edgeRatio.toFixed(RATIO_DIGITS)}`;
    };

    const getExamples = createMemo(() => [
        {
            key: "compass",
            name: "Compass",
            readout: () => describe(getCompassReading()),
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} height={() => COMPASS_HEIGHT} padding={() => BOX_PADDING}>
                    <CompassExample onReadingChange={setCompassReading} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Compass.tsx`,
        },
        {
            key: "lamps",
            name: "Lamps",
            readout: () => "each square reads its own distance — the falloff is three of its own radii",
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} padding={() => BOX_PADDING}>
                    <LampsExample />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Lamps.tsx`,
        },
        {
            key: "castShadow",
            name: "Cast shadow",
            readout: () => describe(getShadowReading()),
            component: () => <CastShadowExample onReadingChange={setShadowReading} />,
            path: `${EXAMPLES_ROOT}/CastShadow.tsx`,
        },
        {
            key: "magnet",
            name: "Magnet",
            readout: () => "reaches from 700px out, never past the pointer, and stops at the room its box leaves it",
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} height={() => MAGNET_HEIGHT} padding={() => BOX_PADDING}>
                    <MagnetExample />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Magnet.tsx`,
        },
        {
            key: "tilt",
            name: "Tilt",
            readout: () => "the in-box ratio, clamped, becomes two rotations of up to 14°",
            component: () => (
                <PageMeasureBox width={() => BOX_WIDTH} height={() => TILT_HEIGHT} padding={() => BOX_PADDING}>
                    <TiltExample />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Tilt.tsx`,
        },
        {
            key: "cardGlow",
            name: "Card glow",
            span: WIDE_SPAN,
            readout: () => "three readings, one document listener — each card lights its own border",
            component: () => <CardGlowExample />,
            path: `${EXAMPLES_ROOT}/CardGlow.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
