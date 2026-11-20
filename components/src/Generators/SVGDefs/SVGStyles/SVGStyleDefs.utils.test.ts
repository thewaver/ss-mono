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
