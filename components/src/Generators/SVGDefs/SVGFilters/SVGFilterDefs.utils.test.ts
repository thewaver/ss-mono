import { describe, expect, it } from "vitest";

import { SVGFilterDefsUtils } from "./SVGFilterDefs.utils";

describe("SVGFilterDefsUtils.createRegistry", () => {
    it("keeps nothing that would leave the picture unchanged, and assembles nothing from nothing", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        expect(registry.addGaussianBlur({ stdDeviation: 0 })).toBeUndefined();
        expect(
            registry.addDropShadow({ dx: 0, dy: 0, stdDeviation: 0, floodColor: "#000", floodOpacity: 1 }),
        ).toBeUndefined();
        expect(registry.addTurbulence({ baseFrequency: 0.1, scale: 0 })).toBeUndefined();
        expect(registry.addHueRotation({ deg: 0 })).toBeUndefined();
        expect(registry.addSaturation({ amount: 1 })).toBeUndefined();
        expect(registry.addBrightness({ amount: 1 })).toBeUndefined();
        expect(registry.addContrast({ amount: 1 })).toBeUndefined();
        expect(registry.addInversion({ amount: 0 })).toBeUndefined();
        expect(registry.addColorChannel({ r: 1, g: 1, b: 1 })).toBeUndefined();
        expect(registry.addSpecularLighting(0)).toBeUndefined();
        expect(registry.computeAssembly()).toBeUndefined();
    });

    it("names each kept effect from the filter's id, counted per kind", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        expect(registry.addGaussianBlur({ stdDeviation: 1 })).toBe("f_gaussianBlur_0");
        expect(registry.addHueRotation({ deg: 90 })).toBe("f_hueRotation_0");
        expect(registry.addGaussianBlur({ stdDeviation: 2 })).toBe("f_gaussianBlur_1");
        expect(registry.addSpecularLighting(undefined)).toBe("f_specularLighting_0");
        expect(registry.addDiffuseLighting()).toBe("f_diffuseLighting_0");
    });

    it("isolates by default: every effect reads the original, and all of them are merged over it", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addHueRotation({ deg: 90 });
        registry.addSaturation({ amount: 0 });

        expect(registry.computeAssembly()).toEqual({
            region: undefined,
            inputs: [
                { key: "f_hueRotation_0", srcIn: "SourceGraphic" },
                { key: "f_saturation_0", srcIn: "SourceGraphic" },
            ],
            mergeKeys: ["SourceGraphic", "f_hueRotation_0", "f_saturation_0"],
        });
    });

    it("chains on request: each effect reads the one before, and nothing is merged", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addHueRotation({ deg: 90 });
        registry.addSaturation({ amount: 0 });

        const assembly = registry.computeAssembly({ method: "chain" });

        expect(assembly?.inputs.map((input) => input.srcIn)).toEqual(["SourceGraphic", "f_hueRotation_0"]);
        expect(assembly?.mergeKeys).toBeUndefined();
    });

    it("grows the region by the furthest reach, exactly around a known size and by doubling otherwise", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addGaussianBlur({ stdDeviation: 2 });
        registry.addDropShadow({ dx: -5, dy: 3, stdDeviation: 1, floodColor: "#000", floodOpacity: 1 });
        registry.addTurbulence({ baseFrequency: 0.1, scale: -10 });

        expect(registry.computeAssembly({ elementSize: { width: 100, height: 50 } })?.region).toEqual({
            filterUnits: "userSpaceOnUse",
            x: "-8px",
            y: "-8px",
            width: "116px",
            height: "66px",
        });
        expect(registry.computeAssembly()?.region).toEqual({ x: "-50%", y: "-50%", width: "200%", height: "200%" });
    });

    it("writes the region as shares of the box when a pixelation is kept", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addGaussianBlur({ stdDeviation: 2 });
        registry.addPixelate({ size: 10 });

        const assembly = registry.computeAssembly({ elementSize: { width: 100, height: 50 } });

        expect(assembly?.region).toEqual({ x: "-0.06", y: "-0.12", width: "1.12", height: "1.24" });
        expect(assembly?.frame).toEqual({ width: 112, height: 62, offset: 6 });
    });

    it("leaves a pixelation out when the element's size is not known, and chains past it", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addHueRotation({ deg: 90 });
        registry.addPixelate({ size: 10 });
        registry.addSaturation({ amount: 2 });

        const assembly = registry.computeAssembly({ method: "chain" });

        expect(assembly?.inputs).toEqual([
            { key: "f_hueRotation_0", srcIn: "SourceGraphic" },
            { key: "f_saturation_0", srcIn: "f_hueRotation_0" },
        ]);
        expect(assembly?.frame).toBeUndefined();

        const alone = SVGFilterDefsUtils.createRegistry("g");

        alone.addPixelate({ size: 10 });

        expect(alone.computeAssembly(), "a pixelation alone leaves no filter at all").toBeUndefined();
    });

    it("leaves the browser's region alone when nothing reaches past the box", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        registry.addHueRotation({ deg: 90 });

        expect(registry.computeAssembly()?.region).toBeUndefined();
    });
});

describe("SVGFilterDefsUtils matrices", () => {
    const rows = (matrix: string) => matrix.split(" ").map(Number);

    it("scales the three color channels and leaves opacity alone", () => {
        expect(rows(SVGFilterDefsUtils.computeBrightnessMatrix({ amount: 2 }))).toEqual([
            2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0,
        ]);
        expect(rows(SVGFilterDefsUtils.computeColorChannelMatrix({ r: 1, g: 0.5, b: 0 }))).toEqual([
            1, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        ]);
    });

    it("pivots contrast about mid-grey and turns a half inversion into flat grey", () => {
        expect(rows(SVGFilterDefsUtils.computeContrastMatrix({ amount: 0 }))).toEqual([
            0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 1, 0,
        ]);
        expect(rows(SVGFilterDefsUtils.computeInversionMatrix({ amount: 0.5 }))).toEqual([
            0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 1, 0,
        ]);
    });
});

describe("SVGFilterDefsUtils.resolveTurbulence", () => {
    it("fills in the noise and channel defaults, and names every intermediate result from the key", () => {
        const resolved = SVGFilterDefsUtils.resolveTurbulence("k", { baseFrequency: { x: 0.1, y: 0.2 }, scale: 8 });

        expect(resolved).toMatchObject({
            type: "fractalNoise",
            numOctaves: 1,
            seed: 0,
            stitchTiles: "noStitch",
            xChannelSelector: "R",
            yChannelSelector: "G",
            edgeFade: 0,
            baseFrequency: "0.1 0.2",
        });
        expect(resolved.keys.noise).toBe("k_noise");
        expect(resolved.keys.maskedNoise).toBe("k_mask_in");
    });

    it("keeps a default where a field is present but undefined", () => {
        expect(SVGFilterDefsUtils.resolveTurbulence("k", { baseFrequency: 1, scale: 1, seed: undefined }).seed).toBe(0);
    });
});

describe("pixelate", () => {
    it("is not kept at a size of one pixel or less, which would change nothing", () => {
        const registry = SVGFilterDefsUtils.createRegistry("f");

        expect(registry.addPixelate({ size: 1 })).toBeUndefined();
        expect(registry.addPixelate({ size: 8 })).toBe("f_pixelate_0");
    });

    it("samples each cell at its middle and grows the sample back out to fill it", () => {
        const resolved = SVGFilterDefsUtils.resolvePixelate(
            "f_pixelate_0",
            { size: 10 },
            {
                width: 120,
                height: 70,
                offset: 10,
            },
        );
        const svg = decodeURIComponent(resolved.gridHref.replace("data:image/svg+xml,", ""));

        expect(resolved.radius).toBe(5);
        expect(svg, "the image is the region's size, so it is never stretched").toContain('width="120" height="70"');
        expect(svg, "the cells start at the element's corner").toContain('x="10" y="10" width="10" height="10"');
        expect(svg, "one dot at each cell's middle").toContain('<rect x="5" y="5" width="1" height="1"/>');
        expect(new Set(Object.values(resolved.keys)).size).toBe(Object.keys(resolved.keys).length);
    });
});
