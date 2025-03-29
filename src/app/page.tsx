"use client";

import { useState, useEffect } from "react";
import { Trip } from "./types";
import TripCard from "./components/TripCard";
import CreateTripModal from "./components/CreateTripModal";
import { getCurrentUser } from "../lib/auth";

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      fetchTrips();
    };
    init();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      const { trips: fetchedTrips } = await response.json();
      setTrips(fetchedTrips || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (newTrip: Omit<Trip, "id">) => {
    try {
      const { user } = await getCurrentUser();
      if (!user) throw new Error("No authenticated user");

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newTrip, userId: user.id }),
      });

      const { trip } = await response.json();
      setTrips([trip, ...trips]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(
      trips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(trips.filter((trip) => trip.id !== tripId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 flex justify-between items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Plan Your Next Adventure with Confidence
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Professional trip planning tools to organize your travels, manage
              activities, and create unforgettable experiences.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-3 h-fit rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl">
            Start Planning
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {trips.length}
            </div>
            <div className="text-sm text-gray-600">Trips Planned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {trips.reduce(
                (acc, trip) => acc + trip.dailyActivities.length,
                0
              )}
            </div>
            <div className="text-sm text-gray-600">Activities Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {trips.reduce((acc, trip) => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                return (
                  acc +
                  Math.ceil(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                  )
                );
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Days of Adventure</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
            <p className="text-gray-600">
              Manage and organize your travel plans
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Filter</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span>Sort</span>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Trip
            </button>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No trips yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your next adventure by creating a new trip.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                Create Your First Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onUpdate={handleUpdateTrip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </main>
  );
}
