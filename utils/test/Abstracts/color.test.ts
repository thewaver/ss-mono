import { describe, expect, it } from "vitest";

import { Color } from "../../src/Abstracts/color.js";

const RED: Color.Hex = "#ff0000";
const GREEN: Color.Hex = "#00ff00";
const BLUE: Color.Hex = "#0000ff";
const GREY: Color.Hex = "#808080";
const CYAN: Color.Hex = "#00ffff";
const NAVY: Color.Hex = "#123456";

const WHITE: Color.Hex = "#ffffff";
const BLACK: Color.Hex = "#000000";

const LEVELS: [Color.ContrastLevel, number][] = [
    ["A", 3],
    ["AA", 4.5],
    ["AAA", 7],
];
const HUES = [0, 37, 74, 111, 148, 185, 222, 259, 296, 333];
const SATURATIONS = [0, 25, 60, 100];
const BACKGROUNDS: string[] = [WHITE, BLACK, GREY, NAVY, "#f0e68c", "hsl(230 40% 12%)"];

const round = (rgb: Color.RGB) => ({
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b),
});

// The WCAG relative luminance formula, written out here rather than taken from the module under
// test, so that an assertion about contrast is not checking the implementation against itself.
const luminanceOf = (rgb: Color.RGB) => {
    const linear = (channel: number) => {
        const ratio = channel / 255;

        return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
    };

    return 0.2126 * linear(rgb.r) + 0.7152 * linear(rgb.g) + 0.0722 * linear(rgb.b);
};

const contrastAgainst = (hsl: Color.HSL | undefined, other: string) => {
    if (!hsl) return 0;

    const mine = luminanceOf(Color.HSL.toRgb(hsl));
    const theirs = luminanceOf(Color.HSVA.toRgba(Color.parse(other) ?? { h: 0, s: 0, v: 0, a: 1 }));

    return (Math.max(mine, theirs) + 0.05) / (Math.min(mine, theirs) + 0.05);
};

describe("Color.RGB.toHex", () => {
    it("writes six lowercase digits", () => {
        expect(Color.RGB.toHex({ r: 255, g: 0, b: 0 })).toBe(RED);
        expect(Color.RGB.toHex({ r: 18, g: 52, b: 86 })).toBe(NAVY);
    });

    it("pads single digit channels", () => {
        expect(Color.RGB.toHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
        expect(Color.RGB.toHex({ r: 1, g: 2, b: 3 })).toBe("#010203");
    });

    it("rounds and clamps out of range channels", () => {
        expect(Color.RGB.toHex({ r: 127.6, g: -20, b: 300 })).toBe("#8000ff");
    });
});

describe("Color.Hex.toRgb", () => {
    it("reads the six digit form", () => {
        expect(Color.Hex.toRgb(NAVY)).toEqual({ r: 18, g: 52, b: 86 });
    });

    it("doubles the digits of the three digit form", () => {
        expect(Color.Hex.toRgb("#f0a")).toEqual({ r: 255, g: 0, b: 170 });
        expect(Color.Hex.toRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("accepts uppercase", () => {
        expect(Color.Hex.toRgb("#FF00AA")).toEqual(Color.Hex.toRgb("#ff00aa"));
    });
});

describe("Color.RGB.toHsv", () => {
    it("places the primaries on their hue", () => {
        expect(Color.Hex.toHsv(RED)).toEqual({ h: 0, s: 100, v: 100 });
        expect(Color.Hex.toHsv(GREEN)).toEqual({ h: 120, s: 100, v: 100 });
        expect(Color.Hex.toHsv(BLUE)).toEqual({ h: 240, s: 100, v: 100 });
    });

    it("reports greys as unsaturated with a hue of zero", () => {
        const grey = Color.Hex.toHsv(GREY);

        expect(grey.s).toBe(0);
        expect(grey.h).toBe(0);
        expect(grey.v).toBeCloseTo(50.2, 1);
    });

    it("reports black as fully dark", () => {
        expect(Color.Hex.toHsv("#000000")).toEqual({ h: 0, s: 0, v: 0 });
    });
});

describe("Color.RGB.toHsl", () => {
    it("places the primaries at half lightness", () => {
        expect(Color.Hex.toHsl(RED)).toEqual({ h: 0, s: 100, l: 50 });
        expect(Color.Hex.toHsl(GREEN)).toEqual({ h: 120, s: 100, l: 50 });
    });

    it("reports white and black as unsaturated", () => {
        expect(Color.Hex.toHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 100 });
        expect(Color.Hex.toHsl("#000000")).toEqual({ h: 0, s: 0, l: 0 });
    });
});

describe("Color hue wrapping", () => {
    it("treats hues outside 0-360 as their wrapped equivalent", () => {
        const base = Color.HSV.toRgb({ h: 30, s: 100, v: 100 });

        expect(Color.HSV.toRgb({ h: 390, s: 100, v: 100 })).toEqual(base);
        expect(Color.HSV.toRgb({ h: -330, s: 100, v: 100 })).toEqual(base);
    });

    it("wraps the hue in HSL as well", () => {
        expect(Color.HSL.toRgb({ h: 390, s: 100, l: 50 })).toEqual(Color.HSL.toRgb({ h: 30, s: 100, l: 50 }));
    });
});

describe("Color clamping", () => {
    it("clamps saturation and value that fall outside 0-100", () => {
        expect(round(Color.HSV.toRgb({ h: 0, s: 500, v: 500 }))).toEqual({ r: 255, g: 0, b: 0 });
        expect(round(Color.HSV.toRgb({ h: 0, s: -100, v: -100 }))).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("clamps alpha on the way in and out", () => {
        expect(Color.RGBA.toHsva({ r: 0, g: 0, b: 0, a: 4 }).a).toBe(1);
        expect(Color.RGBA.toHsva({ r: 0, g: 0, b: 0, a: -4 }).a).toBe(0);
        expect(Color.RGBA.toHexa({ r: 0, g: 0, b: 0, a: 4 })).toBe("#000000ff");
    });
});

describe("Color round trips", () => {
    const samples: Color.Hex[] = [RED, GREEN, BLUE, GREY, NAVY, "#ffffff", "#000000", "#7f3d19"];

    it("survives hex to HSV and back", () => {
        for (const hex of samples) expect(Color.HSV.toHex(Color.Hex.toHsv(hex))).toBe(hex);
    });

    it("survives hex to HSL and back", () => {
        for (const hex of samples) expect(Color.HSL.toHex(Color.Hex.toHsl(hex))).toBe(hex);
    });

    it("survives HSV to HSL and back", () => {
        for (const hex of samples) expect(Color.HSL.toHex(Color.HSV.toHsl(Color.Hex.toHsv(hex)))).toBe(hex);
    });

    it("keeps the alpha channel through every space", () => {
        const hexa: Color.Hexa = "#3366cc80";

        expect(Color.RGBA.toHexa(Color.Hexa.toRgba(hexa))).toBe(hexa);
        expect(Color.HSVA.toHexa(Color.Hexa.toHsva(hexa))).toBe(hexa);
        expect(Color.HSLA.toHexa(Color.Hexa.toHsla(hexa))).toBe(hexa);
        expect(Color.HSVA.toHexa(Color.HSLA.toHsva(Color.Hexa.toHsla(hexa)))).toBe(hexa);
        expect(Color.HSLA.toHexa(Color.HSVA.toHsla(Color.Hexa.toHsva(hexa)))).toBe(hexa);
    });
});

describe("Color.Hexa.toRgba", () => {
    it("reads the alpha pair", () => {
        expect(Color.Hexa.toRgba("#3366cc00").a).toBe(0);
        expect(Color.Hexa.toRgba("#3366ccff").a).toBe(1);
        expect(Color.Hexa.toRgba("#3366cc80").a).toBeCloseTo(0.502, 3);
    });

    it("treats a missing alpha pair as fully opaque", () => {
        expect(Color.Hexa.toRgba("#3366cc").a).toBe(1);
        expect(Color.Hexa.toRgba("#36c").a).toBe(1);
    });

    it("doubles the digits of the four digit form", () => {
        expect(Color.Hexa.toRgba("#36cf")).toEqual(Color.Hexa.toRgba("#3366ccff"));
    });
});

describe("Color.RGBA.toHexa", () => {
    it("always writes the alpha pair", () => {
        expect(Color.RGBA.toHexa({ r: 51, g: 102, b: 204, a: 1 })).toBe("#3366ccff");
        expect(Color.RGBA.toHexa({ r: 51, g: 102, b: 204, a: 0 })).toBe("#3366cc00");
    });
});

describe("Color.Hex.isHex", () => {
    it("accepts the three and six digit forms in either case", () => {
        expect(Color.Hex.isHex("#abc")).toBe(true);
        expect(Color.Hex.isHex("#aabbcc")).toBe(true);
        expect(Color.Hex.isHex("#AABBCC")).toBe(true);
    });

    it("rejects bad characters, wrong lengths and a missing hash", () => {
        expect(Color.Hex.isHex("#abg")).toBe(false);
        expect(Color.Hex.isHex("#abcde")).toBe(false);
        expect(Color.Hex.isHex("aabbcc")).toBe(false);
        expect(Color.Hex.isHex("")).toBe(false);
    });

    it("rejects the forms that carry an alpha pair", () => {
        expect(Color.Hex.isHex("#abcd")).toBe(false);
        expect(Color.Hex.isHex("#aabbccdd")).toBe(false);
    });
});

describe("Color.Hexa.isHexa", () => {
    it("accepts all four lengths, with or without an alpha pair", () => {
        expect(Color.Hexa.isHexa("#abc")).toBe(true);
        expect(Color.Hexa.isHexa("#abcd")).toBe(true);
        expect(Color.Hexa.isHexa("#aabbcc")).toBe(true);
        expect(Color.Hexa.isHexa("#aabbccdd")).toBe(true);
    });

    it("rejects bad characters, wrong lengths and a missing hash", () => {
        expect(Color.Hexa.isHexa("#abcg")).toBe(false);
        expect(Color.Hexa.isHexa("#aabbc")).toBe(false);
        expect(Color.Hexa.isHexa("aabbccdd")).toBe(false);
        expect(Color.Hexa.isHexa("")).toBe(false);
    });
});

describe("Color.isSame", () => {
    it("matches the short and long forms of one colour", () => {
        expect(Color.isSame("#abc", "#aabbcc")).toBe(true);
        expect(Color.isSame("#ABC", "#aabbcc")).toBe(true);
        expect(Color.isSame("#abcf", "#aabbccff")).toBe(true);
    });

    it("separates different colours", () => {
        expect(Color.isSame("#abc", "#abd")).toBe(false);
    });

    it("treats a missing alpha pair as fully opaque", () => {
        expect(Color.isSame("#aabbcc", "#aabbccff")).toBe(true);
    });

    it("separates colours that differ only in opacity", () => {
        expect(Color.isSame("#aabbcc", "#aabbcc80")).toBe(false);
    });

    it("reaches across notations, which is what a single hex comparison could not", () => {
        expect(Color.isSame("red", "#ff0000")).toBe(true);
        expect(Color.isSame("rgb(255 0 0)", "hsl(0 100% 50%)")).toBe(true);
    });

    it("refuses a string that is not a colour rather than guessing", () => {
        expect(Color.isSame("not-a-colour", "#ff0000")).toBe(false);
    });
});

describe("Color.parse and Color.getNotationOf", () => {
    it("reads every notation into one shape", () => {
        expect(Color.parse("red")).toEqual({ h: 0, s: 100, v: 100, a: 1 });
        expect(Color.parse("#ff0000")).toEqual({ h: 0, s: 100, v: 100, a: 1 });
        expect(Color.parse("rgb(255 0 0)")).toEqual({ h: 0, s: 100, v: 100, a: 1 });
        expect(Color.parse("hsl(0 100% 50%)")).toEqual({ h: 0, s: 100, v: 100, a: 1 });
    });

    it("answers nothing for a string it cannot read, rather than a colour", () => {
        expect(Color.parse("not-a-colour")).toBe(undefined);
        expect(Color.getNotationOf("not-a-colour")).toBe(undefined);
    });

    it("reports which notation a string was written in", () => {
        expect(Color.getNotationOf("red")).toBe("name");
        expect(Color.getNotationOf("#ff0000")).toBe("hex");
        expect(Color.getNotationOf("rgb(255 0 0)")).toBe("rgb");
        expect(Color.getNotationOf("hsl(0 100% 50%)")).toBe("hsl");
    });

    it("round trips a value back into the notation it arrived in", () => {
        for (const value of ["#ff0000", "rgb(255, 0, 0)", "hsl(0, 100%, 50%)"]) {
            const notation = Color.getNotationOf(value)!;

            expect(Color.isSame(Color.toNotation(Color.parse(value)!, notation), value)).toBe(true);
            expect(Color.getNotationOf(Color.toNotation(Color.parse(value)!, notation))).toBe(notation);
        }
    });

    it("writes a named colour as hex, since not every colour has a name", () => {
        expect(Color.toNotation(Color.parse("red")!, "name")).toBe("#ff0000");
    });
});

describe("Color.HSVA.getClampedAlpha", () => {
    it("clamps to 0-1", () => {
        expect(Color.HSVA.getClampedAlpha({ h: 0, s: 0, v: 0, a: 4 })).toBe(1);
        expect(Color.HSVA.getClampedAlpha({ h: 0, s: 0, v: 0, a: -4 })).toBe(0);
        expect(Color.HSVA.getClampedAlpha({ h: 0, s: 0, v: 0, a: 0.25 })).toBe(0.25);
    });
});

describe("Color toCss", () => {
    it("writes each space in its own notation", () => {
        const rgb = Color.Hex.toRgb(NAVY);

        expect(Color.RGB.toCss(rgb)).toBe("rgb(18 52 86)");
        expect(Color.HSL.toCss(Color.RGB.toHsl(rgb))).toBe("hsl(210 65.38% 20.39%)");
        expect(Color.HSV.toCss(Color.RGB.toHsv(rgb))).toBe("hwb(210 7.06% 66.27%)");
    });

    it("appends the alpha component for the transparent spaces", () => {
        const rgba = Color.Hexa.toRgba("#3366cc80");

        expect(Color.RGBA.toCss(rgba)).toBe("rgb(51 102 204 / 0.502)");
        expect(Color.HSLA.toCss(Color.RGBA.toHsla(rgba))).toBe("hsl(220 60% 50% / 0.502)");
        expect(Color.HSVA.toCss(Color.RGBA.toHsva(rgba))).toBe("hwb(220 20% 20% / 0.502)");
    });

    it("passes hex through unchanged", () => {
        expect(Color.Hex.toCss(NAVY)).toBe(NAVY);
        expect(Color.Hexa.toCss("#3366cc80")).toBe("#3366cc80");
    });

    it("rounds channels and clamps alpha", () => {
        expect(Color.RGB.toCss({ r: 17.6, g: -5, b: 300 })).toBe("rgb(18 0 255)");
        expect(Color.RGBA.toCss({ r: 0, g: 0, b: 0, a: 4 })).toBe("rgb(0 0 0 / 1)");
    });

    it("describes white and black in every space", () => {
        expect(Color.HSV.toCss({ h: 0, s: 0, v: 100 })).toBe("hwb(0 100% 0%)");
        expect(Color.HSV.toCss({ h: 0, s: 0, v: 0 })).toBe("hwb(0 0% 100%)");
        expect(Color.HSL.toCss({ h: 0, s: 0, l: 100 })).toBe("hsl(0 0% 100%)");
    });
});

describe("Color.RGB.interpolate", () => {
    it("returns the ends at the ends", () => {
        expect(round(Color.RGB.interpolate({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 0))).toEqual({
            r: 0,
            g: 0,
            b: 0,
        });
        expect(round(Color.RGB.interpolate({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 1))).toEqual({
            r: 255,
            g: 255,
            b: 255,
        });
    });

    it("sits halfway between the channels at half", () => {
        expect(round(Color.RGB.interpolate({ r: 0, g: 100, b: 200 }, { r: 200, g: 100, b: 0 }, 0.5))).toEqual({
            r: 100,
            g: 100,
            b: 100,
        });
    });

    it("clamps a ratio outside the range instead of extrapolating", () => {
        const from = { r: 0, g: 0, b: 0 };
        const to = { r: 100, g: 100, b: 100 };

        expect(Color.RGB.interpolate(from, to, -1)).toEqual(Color.RGB.interpolate(from, to, 0));
        expect(Color.RGB.interpolate(from, to, 2)).toEqual(Color.RGB.interpolate(from, to, 1));
    });
});

describe("Color.RGBA.interpolate", () => {
    it("carries the opacity along with the channels", () => {
        const mixed = Color.RGBA.interpolate({ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 1 }, 0.25);

        expect(mixed.a).toBeCloseTo(0.25);
    });
});

describe("Color.HSL.interpolate", () => {
    it("takes the shorter arc across zero rather than the long way round", () => {
        expect(Color.HSL.interpolate({ h: 350, s: 100, l: 50 }, { h: 10, s: 100, l: 50 }, 0.5).h).toBe(0);
    });

    it("does not cross zero when the direct route is shorter", () => {
        expect(Color.HSL.interpolate({ h: 10, s: 100, l: 50 }, { h: 110, s: 100, l: 50 }, 0.5).h).toBe(60);
    });

    it("goes the increasing way when the hues are exactly opposite", () => {
        expect(Color.HSL.interpolate({ h: 0, s: 100, l: 50 }, { h: 180, s: 100, l: 50 }, 0.5).h).toBe(90);
    });

    it("holds saturation up across the blend, where a channel blend would not", () => {
        const viaHue = Color.HSL.interpolate(Color.Hex.toHsl(RED), Color.Hex.toHsl(CYAN), 0.5);
        const viaChannels = Color.RGB.toHsl(Color.RGB.interpolate(Color.Hex.toRgb(RED), Color.Hex.toRgb(CYAN), 0.5));

        expect(viaHue.s).toBeGreaterThan(viaChannels.s);
    });
});

describe("Color.HSV.interpolate", () => {
    it("takes the shorter arc across zero", () => {
        expect(Color.HSV.interpolate({ h: 340, s: 100, v: 100 }, { h: 20, s: 100, v: 100 }, 0.5).h).toBe(0);
    });
});

describe("Color.Hex.interpolate", () => {
    it("returns the ends at the ends", () => {
        expect(Color.Hex.interpolate(RED, BLUE, 0)).toBe(RED);
        expect(Color.Hex.interpolate(RED, BLUE, 1)).toBe(BLUE);
    });

    it("meets in the middle of the channels", () => {
        expect(Color.Hex.interpolate("#000000", "#ffffff", 0.5)).toBe(GREY);
    });

    it("reads the short form on both sides", () => {
        expect(Color.Hex.interpolate("#000", "#fff", 0.5)).toBe(Color.Hex.interpolate("#000000", "#ffffff", 0.5));
    });
});

describe("Color.Hexa.interpolate", () => {
    it("blends the alpha pair as well as the channels", () => {
        expect(Color.Hexa.interpolate("#00000000", "#ffffffff", 0.5)).toBe("#80808080");
    });

    it("reads a value with no alpha pair as opaque", () => {
        expect(Color.Hexa.interpolate("#000000", "#ffffff", 0.5)).toBe("#808080ff");
    });
});

describe("Color.getContrastingColor", () => {
    it("keeps the hue and the saturation it was handed", () => {
        const got = Color.getContrastingColor(210, 80, WHITE, "AA");

        expect(got?.h).toBe(210);
        expect(got?.s).toBe(80);
    });

    it("wraps the hue and clamps the saturation", () => {
        const got = Color.getContrastingColor(-30, 140, WHITE, "AA");

        expect(got?.h).toBe(330);
        expect(got?.s).toBe(100);
    });

    it("reaches each named level against a pale background", () => {
        LEVELS.forEach(([level, wanted]) => {
            expect(contrastAgainst(Color.getContrastingColor(35, 90, WHITE, level), WHITE)).toBeGreaterThanOrEqual(
                wanted,
            );
        });
    });

    it("reaches each named level against a dark background", () => {
        LEVELS.forEach(([level, wanted]) => {
            expect(contrastAgainst(Color.getContrastingColor(35, 90, NAVY, level), NAVY)).toBeGreaterThanOrEqual(
                wanted,
            );
        });
    });

    it("reaches a ratio given as a number", () => {
        expect(contrastAgainst(Color.getContrastingColor(0, 0, GREY, 4), GREY)).toBeGreaterThanOrEqual(4);
    });

    it("stays within reach after the lightness is rounded", () => {
        HUES.forEach((hue) =>
            SATURATIONS.forEach((saturation) =>
                BACKGROUNDS.forEach((background) =>
                    LEVELS.forEach(([level, wanted]) => {
                        const got = Color.getContrastingColor(hue, saturation, background, level);

                        if (got && got.l > 0 && got.l < 100) {
                            expect(contrastAgainst(got, background)).toBeGreaterThanOrEqual(wanted);
                        }
                    }),
                ),
            ),
        );
    });

    it("lands on the side with the most room when no side is asked for", () => {
        expect(Color.getContrastingColor(0, 0, WHITE, "AA")?.l).toBeLessThan(50);
        expect(Color.getContrastingColor(0, 0, NAVY, "AA")?.l).toBeGreaterThan(50);
    });

    it("lands on the side it is asked for when both can reach the target", () => {
        expect(Color.getContrastingColor(0, 0, GREY, "A", { prefer: "darker" })?.l).toBeLessThan(50);
        expect(Color.getContrastingColor(0, 0, GREY, "A", { prefer: "lighter" })?.l).toBeGreaterThan(50);
    });

    it("crosses to the other side rather than missing the target", () => {
        const got = Color.getContrastingColor(0, 0, "#111111", 10, { prefer: "darker" });

        expect(got?.l).toBeGreaterThan(50);
        expect(contrastAgainst(got, "#111111")).toBeGreaterThanOrEqual(10);
    });

    it("stops at the nearest lightness that passes rather than the most extreme one", () => {
        const near = Color.getContrastingColor(0, 0, WHITE, "AA");
        const far = Color.getContrastingColor(0, 0, WHITE, "AAA");

        expect(near?.l).toBeGreaterThan(far?.l ?? 0);
        expect(near?.l).toBeGreaterThan(0);
    });

    it("answers with the highest contrast it can manage when the target is out of reach", () => {
        const got = Color.getContrastingColor(0, 0, GREY, 21);

        expect(got).toEqual({ h: 0, s: 0, l: 0 });
    });

    it("answers with nothing for an unreachable target when told it must be met", () => {
        expect(Color.getContrastingColor(0, 0, GREY, 21, { mustMeetTargetContrast: true })).toBeUndefined();
        expect(Color.getContrastingColor(0, 0, GREY, 3, { mustMeetTargetContrast: true })).toBeDefined();
    });

    it("answers with nothing when the other color cannot be read", () => {
        expect(Color.getContrastingColor(0, 0, "not-a-color", "AA")).toBeUndefined();
    });

    it("takes the other color as a value as well as a string", () => {
        expect(Color.getContrastingColor(120, 60, { r: 255, g: 255, b: 255 }, "AAA")).toEqual(
            Color.getContrastingColor(120, 60, WHITE, "AAA"),
        );
    });

    it("measures a translucent color as though it were opaque", () => {
        expect(Color.getContrastingColor(120, 60, "rgb(255 255 255 / 0.1)", "AAA")).toEqual(
            Color.getContrastingColor(120, 60, WHITE, "AAA"),
        );
    });
});
