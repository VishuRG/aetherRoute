// Saved Trips Page
// Manages bookmarked corridors, rerun simulations, and route sharing

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Navigation, Clock, Trash2, Share2, Play, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const SavedTrips: React.FC = () => {
  const navigate = useNavigate();
  const savedTrips = useAppStore((s) => s.savedTrips);
  const removeSavedTrip = useAppStore((s) => s.removeSavedTrip);
  const setOrigin = useAppStore((s) => s.setOrigin);
  const setDestination = useAppStore((s) => s.setDestination);
  const setVehicleType = useAppStore((s) => s.setVehicleType);
  const addToast = useAppStore((s) => s.addToast);

  const handleRerun = (trip: any) => {
    setOrigin(trip.origin);
    setDestination(trip.destination);
    setVehicleType(trip.vehicleType);
    navigate("/plan");
  };

  const handleShare = (trip: any) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this route from ${trip.origin} to ${trip.destination} on AetherRoute: ${window.location.origin}/plan`
      );
      addToast({
        title: "Link Copied",
        message: "Route share link copied to clipboard.",
        priority: "success",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 space-y-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-sora text-dark-bg dark:text-cream">
              Saved Trips & Corridors
            </h1>
            <p className="text-xs text-muted-dark dark:text-cream/70 mt-1">
              Your bookmarked journeys, daily commutes, and optimized stops
            </p>
          </div>

          <Link
            to="/plan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-forest text-white hover:bg-forest-deep shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {savedTrips.length === 0 ? (
          <div className="p-12 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border text-center space-y-3">
            <Bookmark className="w-12 h-12 text-forest/40 mx-auto" />
            <h3 className="text-base font-bold font-sora text-dark-bg dark:text-cream">
              No Saved Trips Yet
            </h3>
            <p className="text-xs text-muted-dark dark:text-cream/70 max-w-sm mx-auto">
              Plan any route in the planner and tap "Save Route" to bookmark it for fast one-tap navigation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 rounded-3xl bg-cream-card dark:bg-dark-card border border-cream-border dark:border-dark-border shadow-soft flex flex-col justify-between space-y-4 hover:border-forest/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-forest/15 text-forest dark:text-forest-mint">
                      {trip.vehicleType.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-muted-dark dark:text-cream/60">
                      Saved {trip.savedAt}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-sora text-dark-bg dark:text-cream">
                    {trip.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-muted-dark dark:text-cream/80 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-forest shrink-0" />
                      <span className="truncate">{trip.origin}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-vibrant-orange shrink-0" />
                      <span className="truncate">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cream-border/60 dark:border-dark-border/60 text-xs">
                  <div className="flex items-center gap-3 font-mono text-muted-dark dark:text-cream/70">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> {trip.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {trip.durationMin} min
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare(trip)}
                      className="p-2 rounded-xl text-muted-dark hover:text-dark-bg dark:hover:text-cream transition-colors"
                      title="Share trip"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSavedTrip(trip.id)}
                      className="p-2 rounded-xl text-muted-dark hover:text-vibrant-orange transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRerun(trip)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-forest text-white hover:bg-forest-deep shadow-soft text-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
