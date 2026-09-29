import type { JSX } from "solid-js";

import {
    type SVGBrightnessFilterDefs,
    type SVGColorFilterDefs,
    type SVGContrastFilterDefs,
    type SVGDropShadowFilterDefs,
    type SVGFilterAssemblyDefs,
    SVGFilterDefs,
    SVGFilterDefsUtils,
    type SVGGaussianBlurFilterDefs,
    type SVGHueRotationFilterDefs,
    type SVGInversionFilterDefs,
    type SVGSaturationFilterDefs,
    type SVGTurbulenceFilterDefs,
    SVG_FILTER_DEFAULTS,
} from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import type {
    SVGDiffuseLightingFilterSolidDefs,
    SVGLightSourceSolidDefs,
    SVGLightSurfaceSolidDefs,
    SVGSpecularLightingFilterSolidDefs,
} from "./SVGFilterDefsSolid.types";

const renderLightSource = (light: SVGLightSourceSolidDefs) =>
    light.kind === "point" ? (
        <fePointLight x={access(light.x)} y={access(light.y)} z={access(light.z)} />
    ) : (
        <feDistantLight azimuth={access(light.azimuth)} elevation={access(light.elevation)} />
    );

const renderLightSurface = (surface: SVGLightSurfaceSolidDefs, resultKey: string) => {
    const defaults = SVG_FILTER_DEFAULTS.lightSurface;

    return (
        <feTurbulence
            type={access(surface.type) ?? defaults.type}
            baseFrequency={SVGFilterDefsUtils.computeBaseFrequency(access(surface.baseFrequency))}
            numOctaves={access(surface.numOctaves) ?? defaults.numOctaves}
            seed={access(surface.seed) ?? defaults.seed}
            stitchTiles={access(surface.stitchTiles) ?? defaults.stitchTiles}
            result={resultKey}
        />
    );
};

/**
 * Builds an SVG `filter` one effect at a time, then renders it, as Solid markup.
 *
 * Each `add…` call appends an effect and returns the factory, so a filter reads as one chain of calls ending
 * in {@link SVGFilterDefsFactory.computeFilterPrimitives}. An effect whose settings would leave the picture
 * unchanged — a blur of nothing, a saturation of `1` — is not added at all, so a caller can pass settings
 * straight through from a control without checking them first. Every intermediate result is named from the
 * filter's id, so two filters on one page never read each other's results. Which effects are kept and how they
 * are put together is `SVGFilterDefsUtils.createRegistry`'s.
 */
export class SVGFilterDefsFactory {
    private readonly registry: ReturnType<typeof SVGFilterDefsUtils.createRegistry>;
    private filterPrimitives: Record<string, (srcIn: string) => JSX.Element> = {};

    /**
     * @param filterId The id the rendered `filter` carries, which an element points at with `filter: url(#…)`.
     */
    constructor(private readonly filterId: string) {
        this.registry = SVGFilterDefsUtils.createRegistry(filterId);
    }

    /**
     * Renders the filter, with every effect added so far in the order it was added.
     *
     * The method decides what each effect is applied to. `"isolate"`, the default, applies every effect to the
     * original graphic and lays all the results over it, so each effect is seen on its own. `"chain"` feeds each
     * effect the previous one's result, so they compound and the last one is what shows.
     *
     * The filter region is grown to fit effects that reach past the element — a blur's spread, a shadow's offset,
     * a displacement's shift. Given the element's size, it is grown by exactly that reach on every side; without
     * it, any reach at all doubles the region about the element; with no reach, the browser's default stands.
     *
     * @param defs The method, and the element's size in pixels when it is known.
     * @returns The `filter` element, or `undefined` when nothing was added.
     */
    public computeFilterPrimitives = (defs?: SVGFilterAssemblyDefs) => {
        const assembly = this.registry.computeAssembly(defs);

        if (!assembly) return undefined;

        return (
            <filter id={this.filterId} {...assembly.region}>
                {assembly.inputs.map(({ key, srcIn }) => this.filterPrimitives[key](srcIn))}

                {assembly.mergeKeys && (
                    <feMerge>
                        {assembly.mergeKeys.map((key) => (
                            <feMergeNode in={key} />
                        ))}
                    </feMerge>
                )}
            </filter>
        );
    };

    /**
     * Adds a blurred, offset, colored copy of the graphic's shape behind it.
     *
     * Skipped when there is neither blur nor offset.
     *
     * @param defs The offset, the blur's standard deviation, and the shadow's color and opacity.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addDropShadowFilter = (defs: SVGDropShadowFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addDropShadow(defs);

        if (key === undefined) return this;

        const { floodColor, floodOpacity, ...otherDefs } = defs;

        this.filterPrimitives[key] = (srcIn) => (
            <feDropShadow
                {...{ in: srcIn }}
                {...otherDefs}
                result={key}
                flood-color={floodColor}
                flood-opacity={floodOpacity}
            >
                {custom}
            </feDropShadow>
        );

        return this;
    };

    /**
     * Blurs the graphic.
     *
     * Skipped when the standard deviation is `0` or less.
     *
     * @param defs The blur's standard deviation, in user units.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addGaussianBlurFilter = (defs: SVGGaussianBlurFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addGaussianBlur(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feGaussianBlur in={srcIn} {...defs} result={key}>
                {custom}
            </feGaussianBlur>
        );

        return this;
    };

    /**
     * Displaces the graphic's pixels by a field of noise, so its edges ripple or crumble.
     *
     * The noise defaults to one octave of `fractalNoise` at seed `0`, unstitched, driving the horizontal shift
     * from the red channel and the vertical from the green. An `edgeFade` above `0` calms the displacement to
     * nothing within that many user units of the shape's edge, so the outline holds while the inside moves.
     * Skipped when the scale is `0`.
     *
     * @param defs The noise, how far it shifts pixels, which channels drive each axis, and the edge fade.
     * @param custom Content placed inside the noise primitive, for animating the noise.
     * @returns The factory, for the next call.
     */
    public addTurbulenceFilter = (defs: SVGTurbulenceFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addTurbulence(defs);

        if (key === undefined) return this;

        const resolved = SVGFilterDefsUtils.resolveTurbulence(key, defs);
        const keys = resolved.keys;

        this.filterPrimitives[key] = (srcIn: string) => (
            <>
                <feTurbulence
                    type={resolved.type}
                    baseFrequency={resolved.baseFrequency}
                    numOctaves={resolved.numOctaves}
                    seed={resolved.seed}
                    stitchTiles={resolved.stitchTiles}
                    result={keys.noise}
                >
                    {custom}
                </feTurbulence>

                {resolved.edgeFade > 0 && (
                    <>
                        <feColorMatrix
                            in={keys.noise}
                            type="matrix"
                            values={SVGFilterDefs.OPAQUE_ALPHA_MATRIX}
                            result={keys.opaque}
                        />

                        <feFlood flood-color={SVGFilterDefs.NEUTRAL_DISPLACEMENT_COLOR} result={keys.flat} />

                        <feMorphology
                            in="SourceAlpha"
                            operator="erode"
                            radius={resolved.edgeFade}
                            result={keys.eroded}
                        />

                        <feGaussianBlur in={keys.eroded} stdDeviation={resolved.edgeFadeBlur} result={keys.mask} />

                        <feComposite in={keys.opaque} in2={keys.mask} operator="in" result={keys.maskedNoise} />

                        <feComposite in={keys.maskedNoise} in2={keys.flat} operator="over" result={keys.map} />
                    </>
                )}

                <feDisplacementMap
                    in={srcIn}
                    in2={resolved.edgeFade > 0 ? keys.map : keys.noise}
                    scale={resolved.scale}
                    xChannelSelector={resolved.xChannelSelector}
                    yChannelSelector={resolved.yChannelSelector}
                    result={key}
                />
            </>
        );

        return this;
    };

    /**
     * Turns every color round the hue wheel.
     *
     * Skipped at `0` degrees.
     *
     * @param defs The turn, in degrees.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addHueRotationFilter = (defs: SVGHueRotationFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addHueRotation(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix in={srcIn} type="hueRotate" values={`${defs.deg}`} result={key}>
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Scales how vivid the colors are.
     *
     * `0` is greyscale, `1` leaves the colors alone and is skipped, and above `1` oversaturates.
     *
     * @param defs The amount.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addSaturationFilter = (defs: SVGSaturationFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addSaturation(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix in={srcIn} type="saturate" values={`${defs.amount}`} result={key}>
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Multiplies the red, green and blue channels by one amount, leaving opacity alone.
     *
     * `0` is black, `1` leaves the colors alone and is skipped, and above `1` brightens.
     *
     * @param defs The amount.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addBrightnessFilter = (defs: SVGBrightnessFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addBrightness(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix
                in={srcIn}
                type="matrix"
                values={SVGFilterDefsUtils.computeBrightnessMatrix(defs)}
                result={key}
            >
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Pushes every channel away from mid-grey, or pulls it towards it, leaving opacity alone.
     *
     * `0` is flat mid-grey, `1` leaves the colors alone and is skipped, and above `1` raises the contrast.
     *
     * @param defs The amount.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addContrastFilter = (defs: SVGContrastFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addContrast(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix
                in={srcIn}
                type="matrix"
                values={SVGFilterDefsUtils.computeContrastMatrix(defs)}
                result={key}
            >
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Inverts the red, green and blue channels, leaving opacity alone.
     *
     * `1` is a full inversion, `0.5` is flat mid-grey, and `0` leaves the colors alone and is skipped.
     *
     * @param defs The amount.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addInversionFilter = (defs: SVGInversionFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addInversion(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix
                in={srcIn}
                type="matrix"
                values={SVGFilterDefsUtils.computeInversionMatrix(defs)}
                result={key}
            >
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Multiplies the red, green and blue channels each by its own amount, leaving opacity alone.
     *
     * Skipped when all three are `1`.
     *
     * @param defs The multiplier for each channel.
     * @param custom Content placed inside the primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addColorChannelFilter = (defs: SVGColorFilterDefs, custom?: JSX.Element) => {
        const key = this.registry.addColorChannel(defs);

        if (key === undefined) return this;

        this.filterPrimitives[key] = (srcIn: string) => (
            <feColorMatrix
                in={srcIn}
                type="matrix"
                values={SVGFilterDefsUtils.computeColorChannelMatrix(defs)}
                result={key}
            >
                {custom}
            </feColorMatrix>
        );

        return this;
    };

    /**
     * Adds shine, as if a light caught a textured surface laid over the graphic.
     *
     * The surface is a field of noise lit by a point or distant light. The highlights are kept to the graphic's
     * own shape and added to its colors, so they only ever brighten. The specular constant defaults to `1`, the
     * exponent to `20` and the light to white. Skipped when the specular constant is `0` or less. Every value may
     * be an accessor, which the rendered filter follows in place.
     *
     * @param defs The surface, the light, and how strong, tight and colored the shine is.
     * @param custom Content placed inside the lighting primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addSpecularLightingFilter = (defs: SVGSpecularLightingFilterSolidDefs, custom?: JSX.Element) => {
        const key = this.registry.addSpecularLighting(access(defs.specularConstant));

        if (key === undefined) return this;

        const surfaceKey = `${key}_surface`;
        const lightKey = `${key}_light`;
        const maskKey = `${key}_mask`;

        this.filterPrimitives[key] = (srcIn: string) => (
            <>
                {renderLightSurface(defs.surface, surfaceKey)}

                <feSpecularLighting
                    in={surfaceKey}
                    surfaceScale={`${access(defs.surfaceScale)}`}
                    specularConstant={`${access(defs.specularConstant) ?? SVG_FILTER_DEFAULTS.specularConstant}`}
                    specularExponent={`${access(defs.specularExponent) ?? SVG_FILTER_DEFAULTS.specularExponent}`}
                    lighting-color={access(defs.lightingColor) ?? SVG_FILTER_DEFAULTS.lightingColor}
                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    result={lightKey}
                >
                    {renderLightSource(defs.light)}
                    {custom}
                </feSpecularLighting>

                <feComposite
                    in={lightKey}
                    in2="SourceAlpha"
                    operator="in"
                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    result={maskKey}
                />

                <feComposite
                    in={srcIn}
                    in2={maskKey}
                    operator="arithmetic"
                    k1={0}
                    k2={1}
                    k3={1}
                    k4={0}
                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    result={key}
                />
            </>
        );

        return this;
    };

    /**
     * Shades the graphic, as if a light fell across a textured surface laid over it.
     *
     * The surface is a field of noise lit by a point or distant light, and the graphic's colors are multiplied
     * by the result, so the shading only ever darkens. The diffuse constant defaults to `1` and the light to
     * white. Never skipped. Every value may be an accessor, which the rendered filter follows in place.
     *
     * @param defs The surface, the light, and how strong and colored the lighting is.
     * @param custom Content placed inside the lighting primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addDiffuseLightingFilter = (defs: SVGDiffuseLightingFilterSolidDefs, custom?: JSX.Element) => {
        const key = this.registry.addDiffuseLighting();
        const surfaceKey = `${key}_surface`;
        const lightKey = `${key}_light`;

        this.filterPrimitives[key] = (srcIn: string) => (
            <>
                {renderLightSurface(defs.surface, surfaceKey)}

                <feDiffuseLighting
                    in={surfaceKey}
                    surfaceScale={`${access(defs.surfaceScale)}`}
                    diffuseConstant={`${access(defs.diffuseConstant) ?? SVG_FILTER_DEFAULTS.diffuseConstant}`}
                    lighting-color={access(defs.lightingColor) ?? SVG_FILTER_DEFAULTS.lightingColor}
                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    result={lightKey}
                >
                    {renderLightSource(defs.light)}
                    {custom}
                </feDiffuseLighting>

                <feComposite
                    in={lightKey}
                    in2={srcIn}
                    operator="arithmetic"
                    k1={1}
                    k2={0}
                    k3={0}
                    k4={0}
                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    result={key}
                />
            </>
        );

        return this;
    };
}
