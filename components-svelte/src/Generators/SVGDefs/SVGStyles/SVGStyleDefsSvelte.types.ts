import type { SVGStyleClip, SVGStyleGradientPaint, SVGStyleShadow, SVGStyleTile } from "@thewaver/ss-components";

export type SVGStyleClipProps = {
    /** The clip's id and the polygons, in fractions of the painted box, it lets paint through. */
    clip: SVGStyleClip;
};

export type SVGStyleShadowProps = {
    /** The shadow: its color, offset, blur, whether it is inset, the region its filter covers and its cut-out. */
    shadow: SVGStyleShadow;
};

export type SVGStyleTileProps = {
    /** Where the pattern repeats from, how far apart, and which part of the gradient each tile shows. */
    tile: SVGStyleTile;
    /** The gradient each tile is cut from. */
    gradient: SVGStyleGradientPaint;
};
