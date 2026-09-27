// Traffic Service stub
export async function getTrafficData(lat: number, lng: number) {
  return {
    level: "medium" as const,
    description: "Moderate traffic on Ring Road. NH-48 congested near Dhaula Kuan.",
    incidents: [
      { type: "congestion", location: "NH-48 Dhaula Kuan", severity: "high", delay: 35 },
      { type: "roadwork", location: "Ring Road ITO", severity: "medium", delay: 15 },
    ],
    isDemo: true,
  };
}
