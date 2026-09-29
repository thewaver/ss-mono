import { type SVGAnimationDefs } from "@thewaver/ss-components";
import type { SVGAnimateTrack } from "./SVGAnimationsSvelte.types.js";
export declare namespace SVGAnimations {
    namespace Linear {
        const grow: (vName: "x" | "y", v1: number, v2: number, scales: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const sweepOrthogonal: (vName: "x" | "y", v1: number, v2: number, offsets: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const sweepDiagonal: (x1: number, y1: number, x2: number, y2: number, angle: number, offsets: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const rotate: (angles: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
    }
    namespace Radial {
        const grow: (radii: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const sweepOrthogonal: (vName: "cx" | "cy", values: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const sweepDiagonal: (cx: number, cy: number, angle: number, offsets: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
    }
    namespace Path {
        const rotatingArc: (angles: [rotation: number, arcSize: number][], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            paths: string[];
            defs: SVGAnimationDefs;
        }>;
        const rotatingWedges: (wedgeCount: number, wedgeThickness: number, curvature: number, angles: number[], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            paths: string[];
            defs: SVGAnimationDefs;
        }>;
    }
    namespace Gradient {
        const cycleSmoothColors: (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
        const cycleBandedColors: (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => import("../../index.js").MarkupElement<{
            tracks: SVGAnimateTrack[];
            defs: SVGAnimationDefs;
        }>;
    }
}
