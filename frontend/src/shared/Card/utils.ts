import { StaticImageData } from "next/image";

import radiot from "@/image/radiot.jpg";
import webstandarts from "@/image/webstandarts.jpg";
import sharks from "@/image/sharks.jpg";
import leads from "@/image/leads.jpg";
import syntax from "@/image/syntax.jpg";
import tommorow from "@/image/tommorow.jpg";
import bl from "@/image/bl.jpg";
import podlodka from "@/image/podlodka.jpg";
import twit from "@/image/twit.jpg";
import defaultPodcast from "@/image/default.jpg";

export const getCardImage = (imageKey: string) => {
  const dictonary: Record<string, StaticImageData> = {
    radiot: radiot,
    webstandards: webstandarts,
    sharks: sharks,
    teamleads: leads,
    syntax: syntax,
    tomorrow: tommorow,
    bl: bl,
    podlodka: podlodka,
    twih: twit,
  };
  return dictonary[imageKey] || defaultPodcast;
};
