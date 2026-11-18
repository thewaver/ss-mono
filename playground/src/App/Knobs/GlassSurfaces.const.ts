export namespace GlassSurfaceKnobs {
    export const MIN_BORDER_RADIUS = 0;
    export const MAX_BORDER_RADIUS = 160;
    export const BORDER_RADIUS_STEP = 10;
    export const MIN_BORDER_WIDTH = 0;
    export const MAX_BORDER_WIDTH = 12;
    export const BORDER_WIDTH_STEP = 1;
    export const MIN_BLUR_RADIUS = 0;
    export const MAX_BLUR_RADIUS = 20;
    export const BLUR_RADIUS_STEP = 1;
    export const MIN_RIPPLE_SCALE = 0;
    export const MAX_RIPPLE_SCALE = 80;
    export const RIPPLE_SCALE_STEP = 1;
    export const MIN_LIGHT_HEIGHT = 0;
    export const MAX_LIGHT_HEIGHT = 2000;
    export const LIGHT_HEIGHT_STEP = 20;
    export const MIN_SURFACE_SCALE = 0;
    export const MAX_SURFACE_SCALE = 8;
    export const SURFACE_SCALE_STEP = 0.05;
    export const MIN_SPECULAR_CONSTANT = 0;
    export const MAX_SPECULAR_CONSTANT = 4;
    export const SPECULAR_CONSTANT_STEP = 0.05;
    export const MIN_SPECULAR_EXPONENT = 1;
    export const MAX_SPECULAR_EXPONENT = 300;
    export const SPECULAR_EXPONENT_STEP = 1;
    export const MIN_GRAIN_FREQUENCY = 0.005;
    export const MAX_GRAIN_FREQUENCY = 0.3;
    export const GRAIN_FREQUENCY_STEP = 0.005;
    export const MIN_GRAIN_OCTAVES = 1;
    export const MAX_GRAIN_OCTAVES = 5;
    export const GRAIN_OCTAVES_STEP = 1;
    export const MIN_TINT_OPACITY = 0;
    export const MAX_TINT_OPACITY = 1;
    export const TINT_OPACITY_STEP = 0.05;
    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;

    export const STARTING_BORDER_WIDTH = 2;
    export const STARTING_STROKE_CONFIG_KEY = "spot_1";
    export const STARTING_BLUR_WIDTH = 0;

    export const STROKE_CONFIG_KEY_TEXT = {
        label: "Border pattern",
        hint: "Which pointer-following gradient lights the panel's edge. Choosing one brings its own knobs with it.",
        controls: "Picks the example border paint sent to GlassSurfaceProps.computeStrokeDefs",
    };

    export const BORDER_RADIUS_TEXT = {
        label: "Corner radius (px)",
        hint: "How far the panel's corners are rounded.",
        controls: "Sets every corner of GlassSurfaceProps.borderRadii",
    };

    export const BORDER_WIDTH_TEXT = {
        label: "Border width (px)",
        hint: "How thick the lit edge around the panel is.",
        controls: "Sets every side of GlassSurfaceProps.borderWidths",
    };

    export const COLORS_TEXT = {
        label: "Border Colors",
        hint: "The colors the edge light is painted from.",
        controls: "Sets the colors of the example border paint sent to GlassSurfaceProps.computeStrokeDefs",
    };

    export const BLUR_WIDTH_TEXT = {
        label: "Border blur (px)",
        hint: "How far the edge light bleeds outward, which is what makes it glow rather than sit flat.",
        controls: "Sets the blur of the example border paint sent to GlassSurfaceProps.computeStrokeDefs",
    };

    export const BLUR_RADIUS_TEXT = {
        label: "Backdrop blur (px)",
        hint: "How far whatever is behind the panel is blurred as it shows through.",
        controls: "Sets GlassSurfaceProps.glassDefs.backdrop.blurRadius",
    };

    export const NOISE_FREQUENCY_TEXT = {
        label: "Noise scale",
        hint: "How fine the grain dusted over the glass is. Higher numbers make a tighter grain.",
        controls: "Sets GlassSurfaceProps.glassDefs.noise.frequency",
    };

    export const NOISE_OCTAVES_TEXT = {
        label: "Noise octaves",
        hint: "How many layers of grain are piled up. More layers add fine detail and cost more to draw.",
        controls: "Sets GlassSurfaceProps.glassDefs.noise.octaves",
    };

    export const RIPPLE_SCALE_TEXT = {
        label: "Ripple bend (px)",
        hint: "How far the glass bends what is behind it, as though it were not quite flat. 0 leaves it looking like a window.",
        controls: "Sets GlassSurfaceProps.glassDefs.ripple.scale",
    };

    export const LIGHT_HEIGHT_TEXT = {
        label: "Light height",
        hint: "How far above the panel the light lighting the sheen is placed. Lower puts it closer and makes the highlight tighter.",
        controls: "Sets GlassSurfaceProps.glassDefs.sheen.lightHeight",
    };

    export const SURFACE_SCALE_TEXT = {
        label: "Sheen relief",
        hint: "How deep the relief the sheen is shaded against is. 0 leaves the surface flat and kills the highlight.",
        controls: "Sets GlassSurfaceProps.glassDefs.sheen.surfaceScale",
    };

    export const SPECULAR_CONSTANT_TEXT = {
        label: "Sheen brightness",
        hint: "How strong the sheen highlight is overall.",
        controls: "Sets GlassSurfaceProps.glassDefs.sheen.specularConstant",
    };

    export const SPECULAR_EXPONENT_TEXT = {
        label: "Shininess",
        hint: "How tightly the sheen highlight is focused: low is a broad soft gleam, high is a small hard glint.",
        controls: "Sets GlassSurfaceProps.glassDefs.sheen.specularExponent",
    };

    export const TINT_OPACITY_TEXT = {
        label: "Tint opacity",
        hint: "How strongly the panel is colored. 0 leaves it clear.",
        controls: "Sets GlassSurfaceProps.glassDefs.tint.opacity",
    };

    export const TINT_COLOR_TEXT = {
        label: "Tint color",
        hint: "The color the panel itself is tinted with.",
        controls: "Sets GlassSurfaceProps.glassDefs.tint.color",
    };
}
