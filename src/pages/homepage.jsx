import { useState } from "react";
import { CityLoaderScreen, CityLoadingBanner } from "../components/homepage/City";

export default function Homepage({ phase, setPhase }) {

  const bannerDone = phase === "ready";

  return (
    <>
      <CityLoaderScreen onReady={() => setPhase("banner")} />

      {phase !== "loader" && (
        <CityLoadingBanner done={bannerDone} />
      )}
    </>
  );
}