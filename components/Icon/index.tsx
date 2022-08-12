import dynamic from "next/dynamic";
import React from "react";

const Icon = (type: string) => dynamic(
  () => import(`public/icons/${type}.svg`),
  { suspense: true }
);

export default Icon;
