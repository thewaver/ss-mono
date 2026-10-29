import { SLICE_STOP_KEYS } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.const";

const TRACK_KEYS = SLICE_STOP_KEYS;

const MAX_STOPS = 64;

const EASING_SIZE = 65;

const TRACK_DEFINES = TRACK_KEYS.map((key, idx) => `#define T_${key.toUpperCase().replace("-", "_")} ${idx}`).join(
    "\n",
);

const HEADER = `#version 300 es
precision highp float;
precision highp int;
#define BLUR_EPS 0.01
#define BLUR_REACH 3.0
#define BOX_PER_SIGMA 3.4641
`;

const EVALUATION = `
#define TRACK_COUNT ${TRACK_KEYS.length}
#define MAX_STOPS ${MAX_STOPS}
#define EASING_SIZE ${EASING_SIZE}
${TRACK_DEFINES}

uniform highp sampler2D u_tables;
uniform int u_easingRow;
uniform int u_mode;
uniform float u_timeline;
uniform float u_half;
uniform float u_desc;
uniform float u_clock;
uniform float u_lifetime;

layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec4 a_rect;
layout(location = 2) in float a_weight;
layout(location = 3) in float a_table;
layout(location = 4) in vec4 a_tint;
layout(location = 5) in vec4 a_direct;

struct Cell {
    mat3 m;
    vec3 t;
    float opacity;
    float sigma;
    float perspective;
    vec4 colorA;
    float colorB;
};

float sampleTrack(int table, int k, float fallback, float t) {
    vec4 header = texelFetch(u_tables, ivec2(k, table), 0);
    int n = int(header.y);

    if (n == 0) return fallback;

    int base = int(header.x);
    vec4 previous = texelFetch(u_tables, ivec2(base, table), 0);

    if (t <= previous.x) return previous.y;

    for (int i = 1; i < MAX_STOPS; i++) {
        if (i >= n) break;

        vec4 current = texelFetch(u_tables, ivec2(base + i, table), 0);

        if (t <= current.x) {
            float span = current.x - previous.x;
            float ratio = span <= 0.0 ? 1.0 : (t - previous.x) / span;

            return previous.y + (current.y - previous.y) * ratio;
        }

        previous = current;
    }

    return previous.y;
}

bool hasTrack(int table, int k) {
    return texelFetch(u_tables, ivec2(k, table), 0).y > 0.0;
}

float ease(float ratio) {
    float position = ratio * float(EASING_SIZE - 1);
    int idx = min(int(position), EASING_SIZE - 2);
    float low = texelFetch(u_tables, ivec2(idx, u_easingRow), 0).x;
    float high = texelFetch(u_tables, ivec2(idx + 1, u_easingRow), 0).x;

    return mix(low, high, position - float(idx));
}

float localTimeline(float weight) {
    if (u_mode == 1) return u_lifetime <= 0.0 ? 1.0 : clamp((u_clock - weight) / u_lifetime, 0.0, 1.0);

    float directed = u_desc > 0.5 ? weight : 1.0 - weight;
    float start = clamp(directed, 0.0, 1.0) * (1.0 - 2.0 * u_half);
    float end = start + 2.0 * u_half;

    if (end <= start) return u_timeline >= end ? 1.0 : 0.0;

    return ease(clamp((u_timeline - start) / (end - start), 0.0, 1.0));
}

mat3 rotationX(float degrees) {
    float c = cos(radians(degrees));
    float s = sin(radians(degrees));

    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

mat3 rotationY(float degrees) {
    float c = cos(radians(degrees));
    float s = sin(radians(degrees));

    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotationZ(float degrees) {
    float c = cos(radians(degrees));
    float s = sin(radians(degrees));

    return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

Cell evaluateDirect() {
    Cell cell;

    cell.m = rotationZ(a_direct.z) * mat3(a_direct.x, 0.0, 0.0, 0.0, a_direct.y, 0.0, 0.0, 0.0, 1.0);
    cell.t = vec3(0.0);
    cell.opacity = clamp(a_direct.w, 0.0, 1.0);
    cell.sigma = 0.0;
    cell.perspective = 0.0;
    cell.colorA = vec4(1.0, 0.0, 0.0, 0.0);
    cell.colorB = 1.0;

    return cell;
}

Cell evaluate(vec4 rect, float weight, int table) {
    if (u_mode == 2) return evaluateDirect();

    float t = localTimeline(weight);
    vec2 size = rect.zw;
    float scaleX = sampleTrack(table, T_SCALEX, 100.0, t) / 100.0;
    float scaleY = sampleTrack(table, T_SCALEY, 100.0, t) / 100.0;
    mat3 turn = rotationZ(sampleTrack(table, T_ROTATE, 0.0, t))
        * rotationX(sampleTrack(table, T_ROTATEX, 0.0, t))
        * rotationY(sampleTrack(table, T_ROTATEY, 0.0, t));
    mat3 scale = mat3(scaleX, 0.0, 0.0, 0.0, scaleY, 0.0, 0.0, 0.0, 1.0);
    mat3 skewX = mat3(1.0, 0.0, 0.0, tan(radians(sampleTrack(table, T_SKEWX, 0.0, t))), 1.0, 0.0, 0.0, 0.0, 1.0);
    mat3 skewY = mat3(1.0, tan(radians(sampleTrack(table, T_SKEWY, 0.0, t))), 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    vec3 translation = vec3(
        sampleTrack(table, T_TRANSLATEX, 0.0, t) * size.x / 100.0,
        sampleTrack(table, T_TRANSLATEY, 0.0, t) * size.y / 100.0,
        sampleTrack(table, T_TRANSLATEZ, 0.0, t)
    );

    if (hasTrack(table, T_ORIGINX) || hasTrack(table, T_ORIGINY) || hasTrack(table, T_DEPTH)) {
        mat3 folded = turn * scale;
        vec3 anchor = vec3(
            (sampleTrack(table, T_ORIGINX, 0.5, t) - 0.5) * size.x,
            (sampleTrack(table, T_ORIGINY, 0.5, t) - 0.5) * size.y,
            0.0
        );
        vec3 offset = vec3(0.0, 0.0, sampleTrack(table, T_DEPTH, 0.0, t) * max(size.x, size.y) / 100.0);

        translation += anchor - folded * anchor + folded * offset;
    }

    Cell cell;

    cell.m = turn * skewX * skewY * scale;
    cell.t = translation;
    cell.opacity = clamp(sampleTrack(table, T_OPACITY, 100.0, t) / 100.0, 0.0, 1.0);
    cell.sigma = max(sampleTrack(table, T_BLUR, 0.0, t), 0.0);
    cell.perspective = max(sampleTrack(table, T_PERSPECTIVE, 0.0, t), 0.0);
    cell.colorA = vec4(
        max(sampleTrack(table, T_BRIGHTNESS, 100.0, t), 0.0) / 100.0,
        clamp(sampleTrack(table, T_GRAYSCALE, 0.0, t) / 100.0, 0.0, 1.0),
        sampleTrack(table, T_HUE_ROTATE, 0.0, t),
        clamp(sampleTrack(table, T_INVERT, 0.0, t) / 100.0, 0.0, 1.0)
    );
    cell.colorB = max(sampleTrack(table, T_SATURATE, 100.0, t), 0.0) / 100.0;

    return cell;
}
`;

const FILTERS = `
float erfApprox(float x) {
    float a = abs(x);
    float t = 1.0 / (1.0 + 0.3275911 * a);
    float y = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-a * a);

    return sign(x) * y;
}

float edgeMask(float x, float length, float sigma) {
    float scale = 1.0 / (sigma * 1.41421356);

    return 0.5 * (erfApprox(x * scale) - erfApprox((x - length) * scale));
}

vec4 applyColorFilters(vec4 premultiplied, vec4 filtersA, float saturate) {
    if (premultiplied.a <= 0.0 || (filtersA == vec4(1.0, 0.0, 0.0, 0.0) && saturate == 1.0)) return premultiplied;

    vec3 rgb = premultiplied.rgb / premultiplied.a;
    float g = 1.0 - filtersA.y;
    float c = cos(radians(filtersA.z));
    float h = sin(radians(filtersA.z));
    float s = saturate;

    rgb = clamp(rgb * filtersA.x, 0.0, 1.0);
    rgb = clamp(transpose(mat3(
        0.2126 + 0.7874 * g, 0.7152 - 0.7152 * g, 0.0722 - 0.0722 * g,
        0.2126 - 0.2126 * g, 0.7152 + 0.2848 * g, 0.0722 - 0.0722 * g,
        0.2126 - 0.2126 * g, 0.7152 - 0.7152 * g, 0.0722 + 0.9278 * g
    )) * rgb, 0.0, 1.0);
    rgb = clamp(transpose(mat3(
        0.213 + c * 0.787 - h * 0.213, 0.715 - c * 0.715 - h * 0.715, 0.072 - c * 0.072 + h * 0.928,
        0.213 - c * 0.213 + h * 0.143, 0.715 + c * 0.285 + h * 0.140, 0.072 - c * 0.072 - h * 0.283,
        0.213 - c * 0.213 - h * 0.787, 0.715 - c * 0.715 + h * 0.715, 0.072 + c * 0.928 + h * 0.072
    )) * rgb, 0.0, 1.0);
    rgb = mix(rgb, 1.0 - rgb, filtersA.w);
    rgb = clamp(mat3(
        0.213 + 0.787 * s, 0.213 - 0.213 * s, 0.213 - 0.213 * s,
        0.715 - 0.715 * s, 0.715 + 0.285 * s, 0.715 - 0.715 * s,
        0.072 - 0.072 * s, 0.072 - 0.072 * s, 0.072 + 0.928 * s
    ) * rgb, 0.0, 1.0);

    return vec4(rgb * premultiplied.a, premultiplied.a);
}
`;

const DRAW_VERTEX = `${HEADER}${EVALUATION}
uniform vec2 u_size;
uniform vec4 u_area;
uniform float u_perspective;
uniform vec2 u_viewport;
uniform vec2 u_scale;

out vec2 v_local;
flat out vec4 v_tint;
flat out vec4 v_rect;
flat out float v_sigma;
flat out float v_opacity;
flat out vec4 v_filtersA;
flat out float v_filtersB;
flat out int v_table;

void main() {
    Cell cell = evaluate(a_rect, a_weight, int(a_table + 0.5));

    v_rect = a_rect;
    v_tint = a_tint;
    v_sigma = cell.sigma;
    v_opacity = cell.opacity;
    v_filtersA = cell.colorA;
    v_filtersB = cell.colorB;
    v_table = int(a_table + 0.5);
    v_local = vec2(0.0);

    if (cell.opacity <= 0.0) {
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        return;
    }

    float margin = cell.sigma > BLUR_EPS ? ceil(BLUR_REACH * cell.sigma) : 0.0;
    vec2 local = a_corner * (a_rect.zw + 2.0 * margin) - margin;
    vec3 relative = cell.m * vec3(local - 0.5 * a_rect.zw, 0.0) + cell.t;
    float own = cell.perspective > 0.0 ? 1.0 - relative.z / cell.perspective : 1.0;
    vec2 origin = 0.5 * u_size;
    vec2 offset = a_rect.xy + 0.5 * a_rect.zw - origin;
    float w = own - (u_perspective > 0.0 ? relative.z / u_perspective : 0.0);
    vec2 device = (origin * w + relative.xy + offset * own - u_area.xy * w) * u_scale;

    v_local = local;
    gl_Position = vec4(device.x / u_viewport.x * 2.0 - w, w - device.y / u_viewport.y * 2.0, 0.0, w);
}
`;

const DRAW_FRAGMENT = `${HEADER}${FILTERS}
uniform sampler2D u_src;
uniform vec2 u_size;
uniform vec2 u_scale;
uniform int u_channelMode;
uniform int u_isSprite;
uniform float u_srcScale;

in vec2 v_local;
flat in vec4 v_tint;
flat in vec4 v_rect;
flat in float v_sigma;
flat in float v_opacity;
flat in vec4 v_filtersA;
flat in float v_filtersB;
flat in int v_table;

out vec4 outColor;

void main() {
    vec4 color = vec4(0.0);

    vec2 base = u_isSprite == 1 ? vec2(0.0) : v_rect.xy;
    vec2 span = u_isSprite == 1 ? v_rect.zw : u_size;

    if (v_sigma <= BLUR_EPS) {
        vec2 uv = (base + v_local) / span;
        vec4 sampled = texture(u_src, uv);
        bool isInside = u_isSprite == 1 ? all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0))) : uv.x <= 1.0 && uv.y <= 1.0;

        color = isInside ? sampled : vec4(0.0);
    } else {
        vec2 uv = (base + clamp(v_local, vec2(0.0), v_rect.zw)) / span;
        float lod = log2(max(1.0, BOX_PER_SIGMA * v_sigma * u_srcScale));
        float mask = edgeMask(v_local.x, v_rect.z, v_sigma) * edgeMask(v_local.y, v_rect.w, v_sigma);

        color = textureLod(u_src, min(uv, vec2(1.0)), lod) * mask;
    }

    if (u_channelMode > 0) {
        vec3 kept = vec3(equal(ivec3(0, 1, 2), ivec3(v_table)));

        color.rgb = mix(vec3(u_channelMode == 2 ? color.a : 0.0), color.rgb, kept);
    }

    color = vec4(color.rgb * v_tint.rgb, color.a) * v_tint.a;
    outColor = applyColorFilters(color, v_filtersA, v_filtersB) * v_opacity;
}
`;

export namespace SliceRendererConst {
    export const TRACK_KEYS_IN_ORDER = TRACK_KEYS;
    export const MAX_STOPS_PER_TRACK = MAX_STOPS;
    export const EASING_SAMPLE_COUNT = EASING_SIZE;
    export const VERTEX_SHADER = DRAW_VERTEX;
    export const FRAGMENT_SHADER = DRAW_FRAGMENT;
}
