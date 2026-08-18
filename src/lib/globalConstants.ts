// Shared sizing tokens for the analytics panel and its charts — a single
// source of truth so the panel title, stat values/labels, and all three
// charts (pie, histogram, budget) render at one consistent, legible scale.

export const PANEL_TITLE_SIZE = 18;
export const STAT_VALUE_SIZE = 28;
export const STAT_LABEL_SIZE = 15;

// All three chart panels (pie, histogram, budget) share this height so the
// stacked panel column reads as one consistent system.
export const CHART_HEIGHT = 260;

export const CHART_TICK_SIZE = 13;
export const CHART_LABEL_SIZE = 13;
export const CHART_LEGEND_SIZE = 13;
export const CHART_TOOLTIP_SIZE = 13;

export const PIE_OUTER_RADIUS = 100;
export const PIE_INNER_RADIUS = Math.round(PIE_OUTER_RADIUS * 0.55);
export const PIE_ACTIVE_RADIUS_OFFSET = 14;
export const PIE_LABEL_SIZE = 18;
