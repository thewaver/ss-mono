import { SVGFilterDefsFactory } from "../../src";

const Stage = (props: { id: string; filter: ReturnType<SVGFilterDefsFactory["computeFilterPrimitives"]> }) => (
    <div data-filter={props.id}>
        <svg width={0} height={0} aria-hidden="true">
            <defs>{props.filter}</defs>
        </svg>
        <output data-readout="built">{String(props.filter !== undefined)}</output>
    </div>
);

export const Default = () => (
    <>
        <Stage
            id="chain"
            filter={new SVGFilterDefsFactory("chain")
                .addGaussianBlurFilter({ stdDeviation: 2 })
                .addHueRotationFilter({ deg: 90 })
                .computeFilterPrimitives({ method: "chain", elementSize: { width: 100, height: 50 } })}
        />
        <Stage
            id="isolate"
            filter={new SVGFilterDefsFactory("isolate")
                .addDropShadowFilter({ dx: 4, dy: 4, stdDeviation: 1, floodColor: "#FF0000", floodOpacity: 0.5 })
                .addSaturationFilter({ amount: 0 })
                .computeFilterPrimitives()}
        />
        <Stage
            id="identity"
            filter={new SVGFilterDefsFactory("identity")
                .addGaussianBlurFilter({ stdDeviation: 0 })
                .addBrightnessFilter({ amount: 1 })
                .computeFilterPrimitives()}
        />
        <Stage
            id="lighting"
            filter={new SVGFilterDefsFactory("lighting")
                .addDiffuseLightingFilter({
                    light: { kind: "distant", azimuth: 45, elevation: 30 },
                    surface: { baseFrequency: { x: 0.02, y: 0.04 } },
                    surfaceScale: 2,
                })
                .computeFilterPrimitives({ method: "chain" })}
        />
        <Stage
            id="turbulence"
            filter={new SVGFilterDefsFactory("turbulence")
                .addTurbulenceFilter({ baseFrequency: 0.05, scale: 12, edgeFade: 8 })
                .computeFilterPrimitives({ method: "chain" })}
        />
    </>
);
