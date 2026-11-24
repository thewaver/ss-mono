import { afterEach, describe, expect, it, vi } from "vitest";

import type { SVGStyleSource } from "./SVGStyleDefs.types";
import { SVGStyleDefsUtils } from "./SVGStyleDefs.utils";

const COMPUTED_DEFAULTS: Partial<Record<keyof SVGStyleSource, string>> = {
    backgroundAttachment: "scroll",
    backgroundBlendMode: "normal",
    backgroundClip: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0)",
    backgroundImage: "none",
    backgroundOrigin: "padding-box",
    backgroundPosition: "0% 0%",
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    borderImageSource: "none",
    boxShadow: "none",
};

const styleWith = (values: Partial<Record<keyof SVGStyleSource, string>>) =>
    new Proxy(
        { ...COMPUTED_DEFAULTS, ...values },
        {
            get: (target, key) => (key === "getPropertyValue" ? () => "" : (target[key as keyof SVGStyleSource] ?? "")),
        },
    ) as unknown as SVGStyleSource;

describe("SVGStyleDefsUtils.computeDefsFromStyle", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("names in a warning the CSS it cannot reproduce, with its value", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        SVGStyleDefsUtils.computeDefsFromStyle(
            styleWith({ backgroundImage: "conic-gradient(#f00, #00f)" }),
            { width: 100, height: 50 },
            "test",
        );

        expect(warn.mock.calls.some(([message]) => String(message).includes("conic-gradient"))).toBe(true);
    });

    it("hands back a backdrop filter as written, and none when the style sets none", () => {
        const computeBackdrop = (backdropFilter: string) =>
            SVGStyleDefsUtils.computeDefsFromStyle(styleWith({ backdropFilter }), { width: 100, height: 50 }, "test")
                .backdropFilter;

        expect(computeBackdrop("blur(20px)")).toBe("blur(20px)");
        expect(computeBackdrop("none")).toBeUndefined();
    });

    it("reads a gradient whose colors the browser reports as color(srgb …), as it does relative colors", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        const computeFills = (backgroundImage: string) =>
            SVGStyleDefsUtils.computeDefsFromStyle(styleWith({ backgroundImage }), { width: 100, height: 50 }, "test")
                .fill;

        const fromSrgb = computeFills("linear-gradient(color(srgb 0.2 0.4 0.6 / 0.5), color(srgb 1 0.8 0 / 0.25))");
        const fromRgb = computeFills("linear-gradient(rgba(51, 102, 153, 0.5), rgba(255, 204, 0, 0.25))");

        expect(warn.mock.calls.some(([message]) => String(message).includes("background-image"))).toBe(false);
        expect(fromSrgb.length).toBeGreaterThan(0);
        expect(JSON.stringify(fromSrgb)).toBe(JSON.stringify(fromRgb));
    });

    it("keeps a gradient listed after an image whose quoted address holds a parenthesis", () => {
        const gradient = "linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))";
        const computeFills = (backgroundImage: string) =>
            SVGStyleDefsUtils.computeDefsFromStyle(
                styleWith({
                    backgroundImage,
                    backgroundPosition: "0% 0%, 0% 0%",
                    backgroundSize: "auto, auto",
                    backgroundRepeat: "repeat, repeat",
                }),
                { width: 100, height: 50 },
                "test",
            ).fill;

        expect(computeFills(`url("a(b.png"), ${gradient}`)).toHaveLength(
            computeFills(`url("ab.png"), ${gradient}`).length,
        );
        expect(computeFills(`url("ab.png"), ${gradient}`).length).toBeGreaterThan(0);
    });
});
