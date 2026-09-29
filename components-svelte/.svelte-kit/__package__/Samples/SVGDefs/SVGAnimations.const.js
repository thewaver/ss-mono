import { SVGAnimationTracks } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";
import { markup } from "../../Utils/markupUtils.js";
import SVGAnimateGroup from "./SVGAnimateGroup.svelte";
import SVGAnimatedPath from "./SVGAnimatedPath.svelte";
const join = (values) => values.map((value) => `${value}`).join(";");
const animateGroup = (tracks, defs) => markup(SVGAnimateGroup, { tracks, defs });
const animatedPath = (paths, defs) => markup(SVGAnimatedPath, { paths, defs });
export var SVGAnimations;
(function (SVGAnimations) {
    let Linear;
    (function (Linear) {
        Linear.grow = (vName, v1, v2, scales, defs) => {
            const tracks = SVGAnimationTracks.computeGrowTracks(v1, v2, scales);
            return animateGroup([
                { attributeName: `${vName}1`, values: join(tracks.from) },
                { attributeName: `${vName}2`, values: join(tracks.to) },
            ], defs);
        };
        Linear.sweepOrthogonal = (vName, v1, v2, offsets, defs) => animateGroup([
            { attributeName: `${vName}1`, values: join(SVGAnimationTracks.computeOffsetTrack(v1, offsets)) },
            { attributeName: `${vName}2`, values: join(SVGAnimationTracks.computeOffsetTrack(v2, offsets)) },
        ], defs);
        Linear.sweepDiagonal = (x1, y1, x2, y2, angle, offsets, defs) => animateGroup([
            [x1, y1],
            [x2, y2],
        ].flatMap((point, index) => {
            const tracks = SVGAnimationTracks.computeDiagonalTracks(point[0], point[1], angle, offsets);
            return [
                { attributeName: `x${index + 1}`, values: join(tracks.x) },
                { attributeName: `y${index + 1}`, values: join(tracks.y) },
            ];
        }), defs);
        Linear.rotate = (angles, defs) => {
            const tracks = SVGAnimationTracks.computeRotationTracks(angles);
            return animateGroup(SVGAnimationTracks.V_KEYS.map((vKey) => ({ attributeName: vKey, values: join(tracks[vKey]) })), defs);
        };
    })(Linear = SVGAnimations.Linear || (SVGAnimations.Linear = {}));
    let Radial;
    (function (Radial) {
        Radial.grow = (radii, defs) => animateGroup([{ attributeName: "r", values: join(radii) }], defs);
        Radial.sweepOrthogonal = (vName, values, defs) => animateGroup([{ attributeName: vName, values: join(values) }], defs);
        Radial.sweepDiagonal = (cx, cy, angle, offsets, defs) => {
            const tracks = SVGAnimationTracks.computeDiagonalTracks(cx, cy, angle, offsets);
            return animateGroup([
                { attributeName: "cx", values: join(tracks.x) },
                { attributeName: "cy", values: join(tracks.y) },
            ], defs);
        };
    })(Radial = SVGAnimations.Radial || (SVGAnimations.Radial = {}));
    let Path;
    (function (Path) {
        Path.rotatingArc = (angles, defs) => animatedPath(angles.map(([rotation, arcSize]) => SVGUtils.getArcPath(arcSize, rotation)), defs);
        Path.rotatingWedges = (wedgeCount, wedgeThickness, curvature, angles, defs) => animatedPath(angles.map((rotation) => SVGUtils.getWedgesPath(wedgeCount, wedgeThickness, rotation, curvature)), defs);
    })(Path = SVGAnimations.Path || (SVGAnimations.Path = {}));
    let Gradient;
    (function (Gradient) {
        Gradient.cycleSmoothColors = (gradientId, colorTracks, defs) => animateGroup(colorTracks.map((stop, index) => ({
            href: `#${gradientId}-stop-${index}`,
            attributeName: "stop-color",
            values: stop.join(";"),
        })), defs);
        Gradient.cycleBandedColors = (gradientId, colorTracks, defs) => animateGroup(colorTracks.flatMap((stop, index) => [
            { href: `#${gradientId}-stop-${index}-start`, attributeName: "stop-color", values: stop.join(";") },
            ...(index < colorTracks.length - 1
                ? [
                    {
                        href: `#${gradientId}-stop-${index}-end`,
                        attributeName: "stop-color",
                        values: stop.join(";"),
                    },
                ]
                : []),
        ]), defs);
    })(Gradient = SVGAnimations.Gradient || (SVGAnimations.Gradient = {}));
})(SVGAnimations || (SVGAnimations = {}));
