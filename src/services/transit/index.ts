// Transit Service — DMRC Metro GTFS / Delhi Bus route status adapter

import { ECO_CONFIG, getServiceStatus, ServiceDataStatus } from "@/services/config";

export const DELHI_METRO_LINES = [
  { id: "yellow", name: "Yellow Line", color: "#FDD900", from: "Samaypur Badli", to: "HUDA City Centre" },
  { id: "blue", name: "Blue Line", color: "#0077C0", from: "Dwarka Sector 21", to: "Noida Electronic City" },
  { id: "red", name: "Red Line", color: "#E2231A", from: "Rithala", to: "New Bus Adda Ghaziabad" },
  { id: "green", name: "Green Line", color: "#008000", from: "Inderlok/Kirti Nagar", to: "Brigadier Hoshiyar Singh" },
  { id: "violet", name: "Violet Line", color: "#7B2D8B", from: "Kashmere Gate", to: "Raja Nahari Singh" },
  { id: "orange", name: "Airport Express", color: "#F37021", from: "New Delhi", to: "Dwarka Sector 21" },
  { id: "magenta", name: "Magenta Line", color: "#AF145B", from: "Janakpuri West", to: "Botanical Garden" },
  { id: "grey", name: "Grey Line", color: "#9B9B9B", from: "Dwarka", to: "Dhansa Bus Stand" },
];

export async function getMetroStatus(): Promise<{
  status: string;
  delays: { line: string; message: string; severity: string }[];
  dataStatus: ServiceDataStatus;
}> {
  const dataStatus = getServiceStatus("TRANSIT_API_KEY");

  return {
    status: "operational",
    delays: [
      { line: "Yellow Line", message: "Minor delay of 5 min between Vishwavidyalaya and Kashmere Gate", severity: "low" },
    ],
    dataStatus,
  };
}
