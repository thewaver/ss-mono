import type { JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import { access } from "../../../../Utils/propUtils";
import type {
    SVGBrightnessFilterDefs,
    SVGColorFilterDefs,
    SVGContrastFilterDefs,
    SVGDiffuseLightingFilterDefs,
    SVGDropShadowFilterDefs,
    SVGFilterMethod,
    SVGGaussianBlurFilterDefs,
    SVGHueRotationFilterDefs,
    SVGInversionFilterDefs,
    SVGLightSourceDefs,
    SVGLightSurfaceDefs,
    SVGSaturationFilterDefs,
    SVGSpecularLightingFilterDefs,
    SVGTurbulenceFilterDefs,
} from "./SVGFilterDefs.types";

type SVGPrimitiveDefs = {
    method?: SVGFilterMethod;
};

const SVG_PRIMITIVE_DEFS: SVGPrimitiveDefs = {
    method: "isolate",
};

const FALLBACK_FILTER_REGION: JSX.FilterSVGAttributes<SVGFilterElement> = {
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%",
};

const FILTER_COLOR_SPACE = "sRGB";

const NEUTRAL_DISPLACEMENT_COLOR = "#808080";
const OPAQUE_ALPHA_MATRIX = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 1";
const EDGE_FADE_BLUR_RATIO = 0.5;

const renderLightSource = (light: SVGLightSourceDefs) =>
    light.kind === "point" ? (
        <fePointLight x={access(light.x)} y={access(light.y)} z={access(light.z)} />
    ) : (
        <feDistantLight azimuth={access(light.azimuth)} elevation={access(light.elevation)} />
    );

const renderLightSurface = (surface: SVGLightSurfaceDefs, resultKey: string) => {
    const getBaseFrequency = () => {
        const value = access(surface.baseFrequency);

        return typeof value === "number" ? `${value}` : `${value.x} ${value.y}`;
    };

    return (
        <feTurbulence
            type={access(surface.type) ?? "fractalNoise"}
            baseFrequency={getBaseFrequency()}
            numOctaves={access(surface.numOctaves) ?? 1}
            seed={access(surface.seed) ?? 0}
            stitchTiles={access(surface.stitchTiles) ?? "noStitch"}
            result={resultKey}
        />
    );
};

export class SVGFilterDefsFactory {
    private filterPrimitives: Record<string, (srcIn: string) => { element: JSX.Element; resultGraphic: string }> = {};
    private dropShadowCount = 0;
    private gaussianBlurCount = 0;
    private turbulenceCount = 0;
    private hueRotationCount = 0;
    private saturationCount = 0;
    private brightnessCount = 0;
    private contrastCount = 0;
    private inversionCount = 0;
    private colorCount = 0;
    private specularLightingCount = 0;
    private diffuseLightingCount = 0;
    private maxOffset = 0;

    constructor(private readonly filterId: string) {}

    public computeFilterPrimitives = (defs?: SVGPrimitiveDefs & { elementSize?: Size2d }) => {
        const entries = Object.entries(this.filterPrimitives);

        if (entries.length < 1) return undefined;

        const mergedDefs = { ...SVG_PRIMITIVE_DEFS, ...defs };

        let currentSourceGraphic = "SourceGraphic";

        const sizeProps: JSX.FilterSVGAttributes<SVGFilterElement> | undefined = defs?.elementSize
            ? {
                  filterUnits: "userSpaceOnUse",
                  x: `${-this.maxOffset}px`,
                  y: `${-this.maxOffset}px`,
                  width: `${defs.elementSize.width + this.maxOffset * 2}px`,
                  height: `${defs.elementSize.height + this.maxOffset * 2}px`,
              }
            : this.maxOffset > 0
              ? FALLBACK_FILTER_REGION
              : undefined;

        return (
            <filter id={this.filterId} {...sizeProps}>
                {entries.map(([, createPrimitive]) => {
                    const result = createPrimitive(currentSourceGraphic);

                    if (mergedDefs.method === "chain") {
                        currentSourceGraphic = result.resultGraphic;
                    }

                    return result.element;
                })}

                {mergedDefs.method === "isolate" && (
                    <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        {entries.map(([key]) => (
                            <feMergeNode in={key} />
                        ))}
                    </feMerge>
                )}
            </filter>
        );
    };

    public addDropShadowFilter = (defs: SVGDropShadowFilterDefs, custom?: JSX.Element) => {
        if (defs.stdDeviation <= 0 && defs.dx === 0 && defs.dy === 0) return this;

        const key = `${this.filterId}_dropShadow_${this.dropShadowCount++}`;
        const { floodColor, floodOpacity, ...otherDefs } = defs;

        this.maxOffset = Math.max(
            this.maxOffset,
            defs.stdDeviation * 3 + Math.max(Math.abs(defs.dx), Math.abs(defs.dy)),
        );
        this.filterPrimitives[key] = (srcIn) => ({
            element: (
                <feDropShadow
                    {...{ in: srcIn }}
                    {...otherDefs}
                    result={key}
                    flood-color={floodColor}
                    flood-opacity={floodOpacity}
                >
                    {custom}
                </feDropShadow>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addGaussianBlurFilter = (defs: SVGGaussianBlurFilterDefs, custom?: JSX.Element) => {
        if (defs.stdDeviation <= 0) return this;

        const key = `${this.filterId}_gaussianBlur_${this.gaussianBlurCount++}`;

        this.maxOffset = Math.max(this.maxOffset, defs.stdDeviation * 3);
        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feGaussianBlur in={srcIn} {...defs} result={key}>
                    {custom}
                </feGaussianBlur>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addTurbulenceFilter = (defs: SVGTurbulenceFilterDefs, custom?: JSX.Element) => {
        if (defs.scale === 0) return this;

        const key = `${this.filterId}_turbulence_${this.turbulenceCount++}`;
        const noiseKey = `${key}_noise`;
        const opaqueKey = `${key}_opaque`;
        const flatKey = `${key}_flat`;
        const erodedKey = `${key}_eroded`;
        const maskKey = `${key}_mask`;
        const mapKey = `${key}_map`;
        const {
            baseFrequency,
            scale,
            type = "fractalNoise",
            numOctaves = 1,
            seed = 0,
            stitchTiles = "noStitch",
            xChannelSelector = "R",
            yChannelSelector = "G",
            edgeFade = 0,
        } = defs;

        this.maxOffset = Math.max(this.maxOffset, Math.abs(scale) * 0.5);
        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <>
                    <feTurbulence
                        type={type}
                        baseFrequency={
                            typeof baseFrequency === "number"
                                ? `${baseFrequency}`
                                : `${baseFrequency.x} ${baseFrequency.y}`
                        }
                        numOctaves={numOctaves}
                        seed={seed}
                        stitchTiles={stitchTiles}
                        result={noiseKey}
                    >
                        {custom}
                    </feTurbulence>

                    {edgeFade > 0 && (
                        <>
                            <feColorMatrix
                                in={noiseKey}
                                type="matrix"
                                values={OPAQUE_ALPHA_MATRIX}
                                result={opaqueKey}
                            />

                            <feFlood flood-color={NEUTRAL_DISPLACEMENT_COLOR} result={flatKey} />

                            <feMorphology
                                {...{ in: "SourceAlpha" }}
                                operator="erode"
                                radius={edgeFade}
                                result={erodedKey}
                            />

                            <feGaussianBlur
                                in={erodedKey}
                                stdDeviation={edgeFade * EDGE_FADE_BLUR_RATIO}
                                result={maskKey}
                            />

                            <feComposite in={opaqueKey} in2={maskKey} operator="in" result={`${maskKey}_in`} />

                            <feComposite in={`${maskKey}_in`} in2={flatKey} operator="over" result={mapKey} />
                        </>
                    )}

                    <feDisplacementMap
                        in={srcIn}
                        in2={edgeFade > 0 ? mapKey : noiseKey}
                        scale={scale}
                        xChannelSelector={xChannelSelector}
                        yChannelSelector={yChannelSelector}
                        result={key}
                    />
                </>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addHueRotationFilter = (defs: SVGHueRotationFilterDefs, custom?: JSX.Element) => {
        if (defs.deg === 0) return this;

        const key = `${this.filterId}_hueRotation_${this.hueRotationCount++}`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix in={srcIn} type="hueRotate" values={`${defs.deg}`} result={key}>
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addSaturationFilter = (defs: SVGSaturationFilterDefs, custom?: JSX.Element) => {
        if (defs.amount === 1) return this;

        const key = `${this.filterId}_saturation_${this.saturationCount++}`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix in={srcIn} type="saturate" values={`${defs.amount}`} result={key}>
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addBrightnessFilter = (defs: SVGBrightnessFilterDefs, custom?: JSX.Element) => {
        if (defs.amount === 1) return this;

        const key = `${this.filterId}_brightness_${this.brightnessCount++}`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix
                    in={srcIn}
                    type="matrix"
                    values={`${defs.amount} 0 0 0 0
                        0 ${defs.amount} 0 0 0
                        0 0 ${defs.amount} 0 0
                        0 0 0 1 0`}
                    result={key}
                >
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addContrastFilter = (defs: SVGContrastFilterDefs, custom?: JSX.Element) => {
        if (defs.amount === 1) return this;

        const key = `${this.filterId}_contrast_${this.contrastCount++}`;
        const intercept = 0.5 * (1 - defs.amount);

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix
                    in={srcIn}
                    type="matrix"
                    values={`${defs.amount} 0 0 0 ${intercept}
                        0 ${defs.amount} 0 0 ${intercept}
                        0 0 ${defs.amount} 0 ${intercept}
                        0 0 0 1 0`}
                    result={key}
                >
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addInversionFilter = (defs: SVGInversionFilterDefs, custom?: JSX.Element) => {
        if (defs.amount === 0) return this;

        const key = `${this.filterId}_inversion_${this.inversionCount++}`;
        const a = 1 - 2 * defs.amount;
        const b = defs.amount;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix
                    in={srcIn}
                    type="matrix"
                    values={`${a} 0 0 0 ${b}
                        0 ${a} 0 0 ${b}
                        0 0 ${a} 0 ${b}
                        0 0 0 1 0`}
                    result={key}
                >
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addColorChannelFilter = (defs: SVGColorFilterDefs, custom?: JSX.Element) => {
        if (defs.r === 1 && defs.g === 1 && defs.b === 1) return this;

        const key = `${this.filterId}_color_${this.colorCount++}`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <feColorMatrix
                    in={srcIn}
                    type="matrix"
                    values={`${defs.r} 0 0 0 0
                        0 ${defs.g} 0 0 0
                        0 0 ${defs.b} 0 0
                        0 0 0 1 0`}
                    result={key}
                >
                    {custom}
                </feColorMatrix>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addSpecularLightingFilter = (defs: SVGSpecularLightingFilterDefs, custom?: JSX.Element) => {
        const key = `${this.filterId}_specularLighting_${this.specularLightingCount++}`;
        const surfaceKey = `${key}_surface`;
        const lightKey = `${key}_light`;
        const maskKey = `${key}_mask`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <>
                    {renderLightSurface(defs.surface, surfaceKey)}

                    <feSpecularLighting
                        in={surfaceKey}
                        surfaceScale={`${access(defs.surfaceScale)}`}
                        specularConstant={`${access(defs.specularConstant) ?? 1}`}
                        specularExponent={`${access(defs.specularExponent) ?? 20}`}
                        lighting-color={access(defs.lightingColor) ?? "#FFFFFF"}
                        color-interpolation-filters={FILTER_COLOR_SPACE}
                        result={lightKey}
                    >
                        {renderLightSource(defs.light)}
                        {custom}
                    </feSpecularLighting>

                    <feComposite
                        {...{ in: lightKey }}
                        in2="SourceAlpha"
                        operator="in"
                        color-interpolation-filters={FILTER_COLOR_SPACE}
                        result={maskKey}
                    />

                    <feComposite
                        {...{ in: srcIn }}
                        in2={maskKey}
                        operator="arithmetic"
                        k1={0}
                        k2={1}
                        k3={1}
                        k4={0}
                        color-interpolation-filters={FILTER_COLOR_SPACE}
                        result={key}
                    />
                </>
            ),
            resultGraphic: key,
        });

        return this;
    };

    public addDiffuseLightingFilter = (defs: SVGDiffuseLightingFilterDefs, custom?: JSX.Element) => {
        const key = `${this.filterId}_diffuseLighting_${this.diffuseLightingCount++}`;
        const surfaceKey = `${key}_surface`;
        const lightKey = `${key}_light`;

        this.filterPrimitives[key] = (srcIn: string) => ({
            element: (
                <>
                    {renderLightSurface(defs.surface, surfaceKey)}

                    <feDiffuseLighting
                        in={surfaceKey}
                        surfaceScale={`${access(defs.surfaceScale)}`}
                        diffuseConstant={`${access(defs.diffuseConstant) ?? 1}`}
                        lighting-color={access(defs.lightingColor) ?? "#FFFFFF"}
                        color-interpolation-filters={FILTER_COLOR_SPACE}
                        result={lightKey}
                    >
                        {renderLightSource(defs.light)}
                        {custom}
                    </feDiffuseLighting>

                    <feComposite
                        {...{ in: lightKey }}
                        in2={srcIn}
                        operator="arithmetic"
                        k1={1}
                        k2={0}
                        k3={0}
                        k4={0}
                        color-interpolation-filters={FILTER_COLOR_SPACE}
                        result={key}
                    />
                </>
            ),
            resultGraphic: key,
        });

        return this;
    };
}
