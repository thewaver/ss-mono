import { SVGFilterDefs } from "@thewaver/ss-components";
import type { SVGDisplacementChannel, SVGFilterMethod } from "@thewaver/ss-components";

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
}
