import {
    type SVGBrightnessFilterDefs,
    type SVGColorFilterDefs,
    type SVGContrastFilterDefs,
    type SVGDiffuseLightingFilterDefs,
    type SVGDropShadowFilterDefs,
    type SVGFilterAssemblyDefs,
    SVGFilterDefsUtils,
    type SVGGaussianBlurFilterDefs,
    type SVGHueRotationFilterDefs,
    type SVGInversionFilterDefs,
    type SVGPixelateFilterDefs,
    type SVGSaturationFilterDefs,
    type SVGSpecularLightingFilterDefs,
    type SVGTurbulenceFilterDefs,
} from "@thewaver/ss-components";

import { markup } from "../../../Utils/markupUtils.js";
import type { SvelteMarkup } from "../../../Utils/typeUtils.js";
import type { SVGFilterPrimitive } from "./SVGFilterDefsSvelte.types.js";
import SVGFilterElement from "./SVGFilterElement.svelte";

/**
 * Builds an SVG `filter` one effect at a time, then renders it, as Svelte markup.
 *
 * Each `add…` call appends an effect and returns the factory, so a filter reads as one chain of calls ending in
 * {@link SVGFilterDefsFactory.computeFilterPrimitives}. An effect whose settings would leave the picture unchanged —
 * a blur of nothing, a saturation of `1` — is not added at all, so a caller can pass settings straight through from a
 * control without checking them first. Every intermediate result is named from the filter's id, so two filters on one
 * page never read each other's results. Which effects are kept and how they are put together is
 * `SVGFilterDefsUtils.createRegistry`'s.
 */
export class SVGFilterDefsFactory {
    private readonly registry: ReturnType<typeof SVGFilterDefsUtils.createRegistry>;
    private readonly primitives: Record<string, SVGFilterPrimitive> = {};

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
     * The filter region is grown to fit effects that reach past the element — a blur's spread, a shadow's offset, a
     * displacement's shift. Given the element's size, it is grown by exactly that reach on every side; without it,
     * any reach at all doubles the region about the element; with no reach, the browser's default stands. A
     * pixelation needs the element's size, and is left out without it.
     *
     * @param defs The method, and the element's size in pixels when it is known.
     * @returns The `filter` element as markup, for the `Markup` component or a defs record, or `undefined` when
     * nothing was added.
     */
    public computeFilterPrimitives = (defs?: SVGFilterAssemblyDefs) => {
        const assembly = this.registry.computeAssembly(defs);

        if (!assembly) return undefined;

        return markup(SVGFilterElement, { filterId: this.filterId, assembly, primitives: { ...this.primitives } });
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
    public addDropShadowFilter = (defs: SVGDropShadowFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addDropShadow(defs);

        if (key !== undefined) this.primitives[key] = { kind: "dropShadow", key, defs, custom };

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
    public addGaussianBlurFilter = (defs: SVGGaussianBlurFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addGaussianBlur(defs);

        if (key !== undefined) this.primitives[key] = { kind: "gaussianBlur", key, defs, custom };

        return this;
    };

    /**
     * Displaces the graphic's pixels by a field of noise, so its edges ripple or crumble.
     *
     * The noise defaults to one octave of `fractalNoise` at seed `0`, unstitched, driving the horizontal shift from
     * the red channel and the vertical from the green. An `edgeFade` above `0` calms the displacement to nothing
     * within that many user units of the shape's edge, so the contour holds while the inside moves. Skipped when the
     * scale is `0`.
     *
     * @param defs The noise, how far it shifts pixels, which channels drive each axis, and the edge fade.
     * @param custom Content placed inside the noise primitive, for animating the noise.
     * @returns The factory, for the next call.
     */
    public addTurbulenceFilter = (defs: SVGTurbulenceFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addTurbulence(defs);

        if (key !== undefined) this.primitives[key] = { kind: "turbulence", key, defs, custom };

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
    public addHueRotationFilter = (defs: SVGHueRotationFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addHueRotation(defs);

        if (key !== undefined) {
            this.primitives[key] = { kind: "colorMatrix", key, type: "hueRotate", values: `${defs.deg}`, custom };
        }

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
    public addSaturationFilter = (defs: SVGSaturationFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addSaturation(defs);

        if (key !== undefined) {
            this.primitives[key] = { kind: "colorMatrix", key, type: "saturate", values: `${defs.amount}`, custom };
        }

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
    public addBrightnessFilter = (defs: SVGBrightnessFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addBrightness(defs);

        if (key !== undefined) {
            this.primitives[key] = {
                kind: "colorMatrix",
                key,
                type: "matrix",
                values: SVGFilterDefsUtils.computeBrightnessMatrix(defs),
                custom,
            };
        }

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
    public addContrastFilter = (defs: SVGContrastFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addContrast(defs);

        if (key !== undefined) {
            this.primitives[key] = {
                kind: "colorMatrix",
                key,
                type: "matrix",
                values: SVGFilterDefsUtils.computeContrastMatrix(defs),
                custom,
            };
        }

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
    public addInversionFilter = (defs: SVGInversionFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addInversion(defs);

        if (key !== undefined) {
            this.primitives[key] = {
                kind: "colorMatrix",
                key,
                type: "matrix",
                values: SVGFilterDefsUtils.computeInversionMatrix(defs),
                custom,
            };
        }

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
    public addColorChannelFilter = (defs: SVGColorFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addColorChannel(defs);

        if (key !== undefined) {
            this.primitives[key] = {
                kind: "colorMatrix",
                key,
                type: "matrix",
                values: SVGFilterDefsUtils.computeColorChannelMatrix(defs),
                custom,
            };
        }

        return this;
    };

    /**
     * Breaks the graphic into squares of one color each, the color at each square's middle.
     *
     * Use it with the `"chain"` method, or over a graphic that fills its box, since under `"isolate"` the original is
     * laid underneath. It needs the element's size, passed to {@link SVGFilterDefsFactory.computeFilterPrimitives}:
     * without it the squares cannot be laid out and the effect is left out. Skipped for a size of one pixel or less.
     *
     * @param defs How wide each square is, in user units.
     * @param custom Content placed inside the dot image, for animating it.
     * @returns The factory, for the next call.
     */
    public addPixelateFilter = (defs: SVGPixelateFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addPixelate(defs);

        if (key !== undefined) this.primitives[key] = { kind: "pixelate", key, defs, custom };

        return this;
    };

    /**
     * Adds shine, as if a light caught a textured surface laid over the graphic.
     *
     * The surface is a field of noise lit by a point or distant light. The highlights are kept to the graphic's own
     * shape and added to its colors, so they only ever brighten. The specular constant defaults to `1`, the exponent
     * to `20` and the light to white. Skipped when the specular constant is `0` or less.
     *
     * @param defs The surface, the light, and how strong, tight and colored the shine is.
     * @param custom Content placed inside the lighting primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addSpecularLightingFilter = (defs: SVGSpecularLightingFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addSpecularLighting(defs.specularConstant);

        if (key !== undefined) this.primitives[key] = { kind: "specularLighting", key, defs, custom };

        return this;
    };

    /**
     * Shades the graphic, as if a light fell across a textured surface laid over it.
     *
     * The surface is a field of noise lit by a point or distant light, and the graphic's colors are multiplied by the
     * result, so the shading only ever darkens. The diffuse constant defaults to `1` and the light to white. Never
     * skipped.
     *
     * @param defs The surface, the light, and how strong and colored the lighting is.
     * @param custom Content placed inside the lighting primitive, for animating it.
     * @returns The factory, for the next call.
     */
    public addDiffuseLightingFilter = (defs: SVGDiffuseLightingFilterDefs, custom?: SvelteMarkup) => {
        const key = this.registry.addDiffuseLighting();

        this.primitives[key] = { kind: "diffuseLighting", key, defs, custom };

        return this;
    };
}
