export type ScanlineHorizontalSnakeOpts = {
    shiftPercent?: number;
};

export type ScanlineHorizontalSplitOpts = {
    shiftPercent?: number;
};

export type ScanlineHorizontalStretchOpts = {
    peakScalePercent?: number;
};

export type ScanlineHorizontalHueOpts = {};

export type ScanlineHorizontalBrightnessOpts = {};

export type ScanlineHorizontalGrayscaleOpts = {};

export type _ScanlineHorizontalWaveOpts = {
    shiftPercent?: number;
    waveCount?: number;
};

export type _ScanlineHorizontalRollOpts = {
    shiftPercent?: number;
    seamBrightnessPercent?: number;
};

export type _ScanlineHorizontalDropoutOpts = {
    dropChance?: number;
    shiftPercent?: number;
};

export type _ScanlineHorizontalInterlaceOpts = {
    dipPercent?: number;
    fieldCount?: number;
};

export type _ScanlineHorizontalSkewOpts = {
    skewDegrees?: number;
};
