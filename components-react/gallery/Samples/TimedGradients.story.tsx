import { useId } from "react";

import type { SVGDefsColors } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { Shape } from "../../src";
import { elastic_circle_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/elastic_circle_1";
import { elastic_drip_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/elastic_drip_1";
import { elastic_inter_semicircle_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/elastic_inter_semicircle_1";
import { elastic_semicircle_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/elastic_semicircle_1";
import { fill_2c } from "../../src/Samples/SVGDefs/Gradient/Timed/fill_2c";
import { fill_3c } from "../../src/Samples/SVGDefs/Gradient/Timed/fill_3c";
import { fill_diag_2v2c } from "../../src/Samples/SVGDefs/Gradient/Timed/fill_diag_2v2c";
import { flow_2 } from "../../src/Samples/SVGDefs/Gradient/Timed/flow_2";
import { flow_3 } from "../../src/Samples/SVGDefs/Gradient/Timed/flow_3";
import { flow_diag_2 } from "../../src/Samples/SVGDefs/Gradient/Timed/flow_diag_2";
import { flow_diag_3 } from "../../src/Samples/SVGDefs/Gradient/Timed/flow_diag_3";
import { merge_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/merge_1v1";
import { merge_diag_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/merge_diag_1v1";
import { merge_diag_async_4 } from "../../src/Samples/SVGDefs/Gradient/Timed/merge_diag_async_4";
import { orbit_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/orbit_1";
import { orbit_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/orbit_1v1";
import { orbit_async_2v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/orbit_async_2v1";
import { orbit_async_3 } from "../../src/Samples/SVGDefs/Gradient/Timed/orbit_async_3";
import { scan_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/scan_1";
import { scan_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/scan_1v1";
import { scan_diag_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/scan_diag_1";
import { scan_diag_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/scan_diag_1v1";
import { snake_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_1";
import { snake_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_1v1";
import { snake_2 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_2";
import { snake_4 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_4";
import { snake_async_3 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_async_3";
import { snake_inter_2 } from "../../src/Samples/SVGDefs/Gradient/Timed/snake_inter_2";
import { sweep_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/sweep_1";
import { sweep_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/sweep_1v1";
import { sweep_diag_1 } from "../../src/Samples/SVGDefs/Gradient/Timed/sweep_diag_1";
import { sweep_diag_1v1 } from "../../src/Samples/SVGDefs/Gradient/Timed/sweep_diag_1v1";
import { sweep_diag_async_4 } from "../../src/Samples/SVGDefs/Gradient/Timed/sweep_diag_async_4";
import type { TimedGradientConfig } from "../../src/Samples/SVGDefs/SVGDefsReact.types";

const COLORS: SVGDefsColors = { primary: "#FF00FF", secondary: "#00FFFF", tertiary: "#FFFF00", background: "#303048" };
const ANIMATION_DURATION_MS = 1000;
const BLUR_WIDTH = 2;

const SAMPLES: [name: string, config: TimedGradientConfig][] = [
    ["elastic_circle_1", elastic_circle_1({ cycles: true })],
    ["elastic_drip_1", elastic_drip_1({ cycles: true })],
    ["elastic_inter_semicircle_1", elastic_inter_semicircle_1({ cycles: true })],
    ["elastic_semicircle_1", elastic_semicircle_1({ cycles: true })],
    ["fill_2c", fill_2c()],
    ["fill_3c", fill_3c()],
    ["fill_diag_2v2c", fill_diag_2v2c()],
    ["flow_2", flow_2({ cycles: true })],
    ["flow_2_banded", flow_2({ cycles: true, banded: true })],
    ["flow_3", flow_3({ cycles: true })],
    ["flow_3_banded", flow_3({ cycles: true, banded: true })],
    ["flow_diag_2", flow_diag_2({ cycles: true })],
    ["flow_diag_2_banded", flow_diag_2({ cycles: true, banded: true })],
    ["flow_diag_3", flow_diag_3({ cycles: true })],
    ["flow_diag_3_banded", flow_diag_3({ cycles: true, banded: true })],
    ["merge_1v1", merge_1v1({ cycles: true })],
    ["merge_diag_1v1", merge_diag_1v1({ cycles: true })],
    ["merge_diag_async_4", merge_diag_async_4()],
    ["orbit_1", orbit_1({ cycles: true })],
    ["orbit_1v1", orbit_1v1({ cycles: true })],
    ["orbit_async_2v1", orbit_async_2v1()],
    ["orbit_async_3", orbit_async_3()],
    ["scan_1", scan_1({ cycles: true })],
    ["scan_1v1", scan_1v1({ cycles: true })],
    ["scan_diag_1", scan_diag_1({ cycles: true })],
    ["scan_diag_1v1", scan_diag_1v1({ cycles: true })],
    ["snake_1", snake_1({ cycles: true })],
    ["snake_1v1", snake_1v1({ cycles: true })],
    ["snake_2", snake_2({ cycles: true })],
    ["snake_4", snake_4({ cycles: true })],
    ["snake_async_3", snake_async_3()],
    ["snake_inter_2", snake_inter_2({ cycles: true })],
    ["sweep_1", sweep_1({ cycles: true })],
    ["sweep_1v1", sweep_1v1({ cycles: true })],
    ["sweep_diag_1", sweep_diag_1({ cycles: true })],
    ["sweep_diag_1v1", sweep_diag_1v1({ cycles: true })],
    ["sweep_diag_async_4", sweep_diag_async_4({ cycles: true })],
];

const Sample = (props: { name: string; config: TimedGradientConfig }) => {
    const id = useId();

    return (
        <div data-sample={props.name} style={{ width: 160, height: 100, margin: 8 }}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                computeFillDefs={(size, element) =>
                    props.config.computeSVGDefs(id, undefined, element, {
                        getSize: () => size,
                        colors: COLORS,
                        blurWidth: BLUR_WIDTH,
                        animationDurationMs: ANIMATION_DURATION_MS,
                    })
                }
                renderChildren={() => null}
            />
        </div>
    );
};

export const All = () => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
        {SAMPLES.map(([name, config]) => (
            <Sample key={name} name={name} config={config} />
        ))}
    </div>
);
