import type { SVGDefsColors } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { Shape } from "../../src";
import { band_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/band_1";
import { band_1v1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/band_1v1";
import { band_diag_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/band_diag_1";
import { hand_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/hand_1";
import { hand_trail_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/hand_trail_1";
import { hand_trail_2 } from "../../src/Samples/SVGDefs/Gradient/Tracked/hand_trail_2";
import { hand_trail_3 } from "../../src/Samples/SVGDefs/Gradient/Tracked/hand_trail_3";
import { spot_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_1";
import { spot_flare_2 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_flare_2";
import { spot_flare_3 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_flare_3";
import { spot_ripple_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_ripple_1";
import { spot_ripple_2 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_ripple_2";
import { spot_ripple_3 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_ripple_3";
import { spot_smear_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_smear_1";
import { spot_smear_2 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_smear_2";
import { spot_smear_3 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_smear_3";
import { spot_trail_1 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_trail_1";
import { spot_trail_2 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_trail_2";
import { spot_trail_3 } from "../../src/Samples/SVGDefs/Gradient/Tracked/spot_trail_3";
import type { TrackedGradientConfig } from "../../src/Samples/SVGDefs/SVGDefsReact.types";

const SAMPLES: Record<string, () => TrackedGradientConfig> = {
    band_1,
    band_1v1,
    band_diag_1,
    hand_1,
    hand_trail_1,
    hand_trail_2,
    hand_trail_3,
    spot_1,
    spot_flare_2,
    spot_flare_3,
    spot_ripple_1,
    spot_ripple_2,
    spot_ripple_3,
    spot_smear_1,
    spot_smear_2,
    spot_smear_3,
    spot_trail_1,
    spot_trail_2,
    spot_trail_3,
};

const COLORS: SVGDefsColors = {
    primary: "#FF00FF",
    secondary: "#00FFFF",
    tertiary: "#FFFF00",
    background: "#223344",
};

const BLUR_WIDTH = 4;
const SAMPLE_SIZE = { width: 160, height: 120 };

const renderSample = (name: string) => (
    <div key={name} data-sample={name} style={SAMPLE_SIZE}>
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            joinRadii={[12]}
            computeFillDefs={(size, element) =>
                SAMPLES[name]().computeSVGDefs(name, undefined, element, {
                    getSize: () => size,
                    colors: COLORS,
                    blurWidth: BLUR_WIDTH,
                })
            }
            renderChildren={() => <div style={SAMPLE_SIZE} />}
        />
    </div>
);

export const All = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 16 }}>
        {Object.keys(SAMPLES).map(renderSample)}
    </div>
);

export const One = (props: { name: string }) => <div style={{ padding: 16 }}>{renderSample(props.name)}</div>;
