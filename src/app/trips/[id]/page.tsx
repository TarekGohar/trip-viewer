"use client";

import { useEffect, useState } from "react";
import { Trip } from "../../types";
import TripCard from "../../components/TripCard";

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        const data = await response.json();
        setTrip(data.trip);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleUpdate = async (updatedTrip: Trip) => {
    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTrip),
      });
      const data = await response.json();
      setTrip(data.trip);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });
      // Redirect to home page after deletion
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Trip not found
          </h1>
          <p className="text-gray-600">
            The trip you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TripCard trip={trip} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
