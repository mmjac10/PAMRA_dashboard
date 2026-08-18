"use client";

import { useEffect } from "react";
import { useMap, Pane, TileLayer, Polygon } from "react-leaflet";
import { PUNJAB_BOUNDARY } from "@/lib/punjabBoundary";

// A second copy of the tile layer, blurred and dimmed via CSS `filter` on its
// pane (so the blur applies to the whole composited layer, not per-tile) and
// clipped to everywhere OUTSIDE Punjab's real border. It sits above the
// crisp base tile layer, so Punjab stays sharp while neighboring cities'
// labels — baked into the raster tiles, so they can't be targeted
// individually — become illegible. The clip-path is screen-pixel based, so
// it's recomputed on every pan/zoom/resize.
function BlurredOutsideLayer() {
  const map = useMap();

  useEffect(() => {
    function update() {
      const pane = map.getPane("blurredOutside");
      if (!pane) return;
      const { x: w, y: h } = map.getSize();
      const outer = `M0 0 H${w} V${h} H0 Z`;
      const points = PUNJAB_BOUNDARY.map(([lat, lng]) => {
        const p = map.latLngToContainerPoint([lat, lng]);
        return `${p.x} ${p.y}`;
      });
      const inner = `M${points.join(" L")} Z`;
      pane.style.clipPath = `path(evenodd, "${outer} ${inner}")`;
      // Same dark-mode conversion as the base tile layer, plus extra blur
      // and dimming so it reads as receding into the background.
      pane.style.filter =
        "invert(1) hue-rotate(185deg) contrast(1.15) saturate(0.4) brightness(0.45) blur(4px)";
      pane.style.pointerEvents = "none";
    }

    update();
    map.on("move zoom resize", update);
    return () => {
      map.off("move zoom resize", update);
    };
  }, [map]);

  return (
    <Pane name="blurredOutside" style={{ zIndex: 350 }}>
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </Pane>
  );
}

export default function PunjabMask() {
  return (
    <>
      <BlurredOutsideLayer />
      <Polygon
        positions={[PUNJAB_BOUNDARY]}
        pathOptions={{
          stroke: true,
          color: "#22e5a0",
          weight: 2,
          opacity: 0.65,
          fill: false,
        }}
        interactive={false}
      />
    </>
  );
}
