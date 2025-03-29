"use client";

import { useEffect, useState } from "react";
import { Trip, DailyActivity } from "../../types";
import { format, parseISO } from "date-fns";
import TripCard from "../../components/TripCard";
import { useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    activity: Omit<DailyActivity, "id" | "tripId" | "createdAt" | "updatedAt">
  ) => void;
  date: string;
}

function ActivityModal({ isOpen, onClose, onSave, date }: ActivityModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      location,
      date,
      time,
      notes,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Add Activity
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., morning, sightseeing, food"
            />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TripPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [generalDescription, setGeneralDescription] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setCurrentUserId(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`);
        const data = await response.json();
        setTrip(data.trip);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleUpdate = async (updatedTrip: Trip) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
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
      await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });
      // Redirect to home page after deletion
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleAddActivity = async (
    activity: Omit<DailyActivity, "id" | "tripId" | "createdAt" | "updatedAt">
  ) => {
    if (!trip) return;

    try {
      const response = await fetch(`/api/trips/${tripId}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });
      const data = await response.json();

      // Update the trip with the new activity
      setTrip((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyActivities: [...(prev.dailyActivities || []), data.activity],
        };
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const handleUpdateDescription = async () => {
    if (!trip) return;

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...trip,
          generalDescription: generalDescription || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update description");
      }

      const data = await response.json();
      setTrip(data.trip);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!trip) return;

    try {
      const response = await fetch(`/api/trips/${tripId}/activities`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: activityId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      // Update the trip state by removing the deleted activity
      setTrip((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyActivities: prev.dailyActivities.filter(
            (activity) => activity.id !== activityId
          ),
        };
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const canEdit = currentUserId === trip?.userId;

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

  // Group activities by date
  const activitiesByDate =
    trip.dailyActivities?.reduce((acc, activity) => {
      const date = activity.date.split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, DailyActivity[]>) || {};

  // Get array of dates between start and end date
  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);
  const dates: string[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[120rem] mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-8 mb-8">
          <TripCard
            trip={trip}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            showActions={true}
          />
        </div>

        {/* General Description Section */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Trip Overview
            </h2>
            {canEdit && (
              <button
                onClick={() => {
                  if (isEditing) {
                    handleUpdateDescription();
                  } else {
                    setGeneralDescription(trip?.generalDescription || "");
                    setIsEditing(true);
                  }
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500">
                {isEditing ? "Save Changes" : "Edit Description"}
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={generalDescription}
              onChange={(e) => setGeneralDescription(e.target.value)}
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a general description of your trip..."
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {trip?.generalDescription || "No description added yet."}
            </p>
          )}
        </div>

        <div className="space-y-16">
          {dates.map((date) => (
            <div key={date} className="bg-white rounded-2xl p-8">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {format(parseISO(date), "EEEE, MMMM d")}
                </h2>
                {canEdit && (
                  <button
                    onClick={() => {
                      setSelectedDate(date);
                      setIsModalOpen(true);
                    }}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Activity
                  </button>
                )}
              </div>

              {activitiesByDate[date]?.length ? (
                <div className="space-y-8">
                  {activitiesByDate[date].map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-xl font-medium text-gray-900">
                            {activity.title}
                          </h3>
                          <p className="text-gray-600 text-base leading-relaxed">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {activity.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {activity.time && (
                            <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg">
                              {activity.time}
                            </span>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="text-red-600 hover:text-red-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {activity.notes && (
                        <p className="mt-4 text-gray-600 text-sm">
                          {activity.notes}
                        </p>
                      )}
                      {activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {activity.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-white text-gray-600 text-sm px-4 py-2 rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500 text-lg">
                    No activities planned for this day
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddActivity}
        date={selectedDate}
      />
    </div>
  );
}
