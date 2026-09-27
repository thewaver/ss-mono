import { useId, useState } from "react";

import type { SVGDefsColors } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { Shape } from "../../src";
import { circle_g_2 } from "../../src/Samples/SVGDefs/Pattern/circle_g_2";
import { circle_hd_2 } from "../../src/Samples/SVGDefs/Pattern/circle_hd_2";
import { circle_hs_2 } from "../../src/Samples/SVGDefs/Pattern/circle_hs_2";
import { hexagon_ft_2 } from "../../src/Samples/SVGDefs/Pattern/hexagon_ft_2";
import { hexagon_pt_2 } from "../../src/Samples/SVGDefs/Pattern/hexagon_pt_2";
import { lozenge_d_2 } from "../../src/Samples/SVGDefs/Pattern/lozenge_d_2";
import { triangle_s_2 } from "../../src/Samples/SVGDefs/Pattern/triangle_s_2";
import { triangle_t_2 } from "../../src/Samples/SVGDefs/Pattern/triangle_t_2";
import { whirl_2 } from "../../src/Samples/SVGDefs/Pattern/whirl_2";
import { whirl_curved_2 } from "../../src/Samples/SVGDefs/Pattern/whirl_curved_2";
import type { PatternConfig } from "../../src/Samples/SVGDefs/SVGDefsReact.types";

const COLORS: SVGDefsColors = { primary: "#FFFF00", secondary: "#00FFFF", tertiary: "#FF00FF", background: "#282420" };
const CELL_SIZE = { width: 20, height: 20 };
const ANIMATION_DURATION_MS = 1000;

const SAMPLES: [name: string, config: PatternConfig][] = [
    ["circle_g_2", circle_g_2],
    ["circle_hd_2", circle_hd_2],
    ["circle_hs_2", circle_hs_2],
    ["hexagon_ft_2", hexagon_ft_2],
    ["hexagon_pt_2", hexagon_pt_2],
    ["lozenge_d_2", lozenge_d_2],
    ["triangle_s_2", triangle_s_2],
    ["triangle_t_2", triangle_t_2],
    ["whirl_2", whirl_2],
    ["whirl_curved_2", whirl_curved_2],
];

const Sample = (props: { name: string; config: PatternConfig }) => {
    const id = useId();

    return (
        <div data-sample={props.name} style={{ width: 160, height: 100, margin: 8 }}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                computeFillDefs={(size, element) =>
                    props.config.computeSVGDefs(id, undefined, element, {
                        getSize: () => size,
                        cellSize: CELL_SIZE,
                        colors: COLORS,
                        animationDurationMs: ANIMATION_DURATION_MS,
                    })
                }
                renderChildren={() => null}
            />
        </div>
    );
};

export const All = () => {
    const [renderCount, setRenderCount] = useState(0);

    return (
        <>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {SAMPLES.map(([name, config]) => (
                    <Sample key={name} name={name} config={config} />
                ))}
            </div>
            <button data-action="rerender" onClick={() => setRenderCount((count) => count + 1)}>
                {`rerender ${renderCount}`}
            </button>
        </>
    );
};
