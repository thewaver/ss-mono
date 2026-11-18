import { type SVGDisplacementChannel, SVGFilterDefs, type SVGFilterMethod } from "@thewaver/ss-components";

export namespace SVGFilterKnobs {
    export const STARTING_METHOD: SVGFilterMethod = "chain";
    export const STARTING_IS_SIZED_FROM_ELEMENT = true;

    export namespace Blur {
        export const MIN_DEVIATION = 0;
        export const MAX_DEVIATION = 12;
        export const DEVIATION_STEP = 0.5;
        export const STARTING_DEVIATION = 3;
    }

    export namespace DropShadow {
        export const MIN_OFFSET = -30;
        export const MAX_OFFSET = 30;
        export const MIN_DEVIATION = 0;
        export const MAX_DEVIATION = 12;
        export const DEVIATION_STEP = 0.5;
        export const MIN_OPACITY = 0;
        export const MAX_OPACITY = 1;
        export const OPACITY_STEP = 0.05;
        export const STARTING_DX = 8;
        export const STARTING_DY = 8;
        export const STARTING_DEVIATION = 4;
        export const STARTING_OPACITY = 0.6;
        export const STARTING_COLOR = "#000000";
    }

    export namespace Turbulence {
        export const MIN_FREQUENCY = 0.001;
        export const MAX_FREQUENCY = 0.2;
        export const FREQUENCY_STEP = 0.001;
        export const MIN_SCALE = 0;
        export const MAX_SCALE = 200;
        export const MIN_OCTAVES = 1;
        export const MAX_OCTAVES = 6;
        export const MIN_SEED = 0;
        export const MAX_SEED = 60;

        export const STARTING_FREQUENCY_X = 0.015;
        export const STARTING_FREQUENCY_Y = 0.015;
        export const STARTING_SCALE = 30;
        export const STARTING_OCTAVES = 2;
        export const STARTING_SEED = 5;
        export const STARTING_TYPE = SVGFilterDefs.TURBULENCE_TYPES[0];
        export const STARTING_X_CHANNEL: SVGDisplacementChannel = "R";
        export const STARTING_Y_CHANNEL: SVGDisplacementChannel = "G";
    }

    export namespace Hue {
        export const MIN_DEG = 0;
        export const MAX_DEG = 360;
        export const DEG_STEP = 5;
        export const MIN_AMOUNT = 0;
        export const MAX_AMOUNT = 3;
        export const AMOUNT_STEP = 0.05;
        export const MIN_CHANNEL = 0;
        export const MAX_CHANNEL = 2;
        export const CHANNEL_STEP = 0.05;

        export const STARTING_DEG = 90;
        export const STARTING_SATURATION = 1.6;
        export const STARTING_CHANNEL = 1;
    }

    export namespace Pixelate {
        export const MIN_SIZE = 1;
        export const MAX_SIZE = 40;
        export const SIZE_STEP = 1;

        export const STARTING_SIZE = 10;
    }

    export namespace Tone {
        export const MIN_AMOUNT = 0;
        export const MAX_AMOUNT = 3;
        export const AMOUNT_STEP = 0.05;
        export const MIN_INVERSION = 0;
        export const MAX_INVERSION = 1;
        export const INVERSION_STEP = 0.05;

        export const STARTING_BRIGHTNESS = 1.2;
        export const STARTING_CONTRAST = 1.4;
        export const STARTING_INVERSION = 0;
    }

    export const STD_DEVIATION_TEXT = {
        label: "Std deviation",
        hint: "How far the blur reaches. 0 leaves the picture sharp.",
        controls: "Sets SVGGaussianBlurFilterDefs.stdDeviation",
    };

    export const DX_TEXT = {
        label: "Offset x",
        hint: "How far the shadow is thrown sideways from the shape casting it.",
        controls: "Sets SVGDropShadowFilterDefs.dx",
    };

    export const DY_TEXT = {
        label: "Offset y",
        hint: "How far the shadow is thrown up or down from the shape casting it.",
        controls: "Sets SVGDropShadowFilterDefs.dy",
    };

    export const SHADOW_STD_DEVIATION_TEXT = {
        label: "Std deviation",
        hint: "How soft the shadow's edge is. 0 gives a hard copy of the shape.",
        controls: "Sets SVGDropShadowFilterDefs.stdDeviation",
    };

    export const FLOOD_COLOR_TEXT = {
        label: "Flood color",
        hint: "The color the shadow is painted in.",
        controls: "Sets SVGDropShadowFilterDefs.floodColor",
    };

    export const FLOOD_OPACITY_TEXT = {
        label: "Flood opacity",
        hint: "How solid the shadow is. 0 hides it entirely.",
        controls: "Sets SVGDropShadowFilterDefs.floodOpacity",
    };

    export const TYPE_TEXT = {
        label: "Type",
        hint: "Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined.",
        controls: "Sets SVGTurbulenceFilterDefs.type",
    };

    export const BASE_FREQUENCY_X_TEXT = {
        label: "Base frequency x",
        hint: "How fine the noise is across. Higher numbers make a tighter grain.",
        controls: "Sets the x of SVGTurbulenceFilterDefs.baseFrequency",
    };

    export const BASE_FREQUENCY_Y_TEXT = {
        label: "Base frequency y",
        hint: "How fine the noise is down. Set it apart from the across value to stretch the grain.",
        controls: "Sets the y of SVGTurbulenceFilterDefs.baseFrequency",
    };

    export const SCALE_TEXT = {
        label: "Scale",
        hint: "How far the noise pushes the picture about. 0 leaves the picture where it was.",
        controls: "Sets SVGTurbulenceFilterDefs.scale",
    };

    export const NUM_OCTAVES_TEXT = {
        label: "Octaves",
        hint: "How many layers of noise are piled up. More layers add fine detail and cost more to draw.",
        controls: "Sets SVGTurbulenceFilterDefs.numOctaves",
    };

    export const SEED_TEXT = {
        label: "Seed",
        hint: "The number the random noise is grown from. Change it for a different pattern at the same settings.",
        controls: "Sets SVGTurbulenceFilterDefs.seed",
    };

    export const X_CHANNEL_SELECTOR_TEXT = {
        label: "X channel",
        hint: "Which channel of the noise decides how far each point moves sideways.",
        controls: "Sets SVGTurbulenceFilterDefs.xChannelSelector",
    };

    export const Y_CHANNEL_SELECTOR_TEXT = {
        label: "Y channel",
        hint: "Which channel of the noise decides how far each point moves up or down.",
        controls: "Sets SVGTurbulenceFilterDefs.yChannelSelector",
    };

    export const DEG_TEXT = {
        label: "Hue rotation",
        hint: "How far every color is turned round the color wheel.",
        controls: "Sets SVGHueRotationFilterDefs.deg",
    };

    export const SATURATION_TEXT = {
        label: "Saturation",
        hint: "How colorful the result is. 0 takes it to gray, above 1 pushes the colors harder.",
        controls: "Sets SVGSaturationFilterDefs.amount",
    };

    export const RED_TEXT = {
        label: "Red",
        hint: "How much the red channel is scaled on its own, after the hue and saturation have been applied.",
        controls: "Sets SVGColorFilterDefs.r",
    };

    export const GREEN_TEXT = {
        label: "Green",
        hint: "How much the green channel is scaled on its own, after the hue and saturation have been applied.",
        controls: "Sets SVGColorFilterDefs.g",
    };

    export const BLUE_TEXT = {
        label: "Blue",
        hint: "How much the blue channel is scaled on its own, after the hue and saturation have been applied.",
        controls: "Sets SVGColorFilterDefs.b",
    };

    export const BRIGHTNESS_TEXT = {
        label: "Brightness",
        hint: "How much lighter or darker the picture is. 1 leaves it alone.",
        controls: "Sets SVGBrightnessFilterDefs.amount",
    };

    export const CONTRAST_TEXT = {
        label: "Contrast",
        hint: "How far the lights and darks are pushed apart. 1 leaves it alone.",
        controls: "Sets SVGContrastFilterDefs.amount",
    };

    export const INVERSION_TEXT = {
        label: "Inversion",
        hint: "How far the colors are flipped to their opposites. 0 leaves them alone, 1 fully inverts.",
        controls: "Sets SVGInversionFilterDefs.amount",
    };

    export const PIXEL_SIZE_TEXT = {
        label: "Square size (px)",
        hint: "How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone.",
        controls: "Sets SVGPixelateFilterDefs.size",
    };

    export const METHOD_TEXT = {
        label: "Method",
        hint: "Whether each step is fed the result of the one before it, or each works from the original and the results are combined.",
        controls: "Sets SVGFilterAssemblyDefs.method",
    };

    export const ELEMENT_SIZE_TEXT = {
        label: "Region sized from the element",
        hint: "Sizes the area the filter is allowed to paint in from the element itself, rather than from a fixed region.",
        controls: "Switches SVGFilterAssemblyDefs.elementSize between the example element's size and none",
    };
}
