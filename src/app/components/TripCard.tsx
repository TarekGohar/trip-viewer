import { Trip } from "../types";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

interface TripCardProps {
  trip: Trip;
  onUpdate?: (trip: Trip) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function TripCard({
  trip,
  onUpdate,
  onDelete,
  showActions = false,
}: TripCardProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);
  const duration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const canEdit = currentUserId === trip.userId;

  // Fallback image if none provided
  const imageUrl =
    trip.imageUrl ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000";

  return (
    <div className="relative rounded-2xl overflow-hidden group min-h-[300px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageUrl}
          alt={trip.title}
          fill
          className="object-cover w-full h-full"
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-transparent group-hover:from-white/40 group-hover:via-white/30 group-hover:to-transparent transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex justify-between items-start flex-1">
          <div className="space-y-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3 drop-shadow-sm">
                {trip.title}
              </h2>
              <p className="text-gray-800 text-lg font-medium">
                {trip.description}
              </p>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  Duration
                </div>
                <div className="text-gray-900 font-medium">
                  {duration} {duration === 1 ? "day" : "days"}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  From
                </div>
                <div className="text-gray-900 font-medium">
                  {format(startDate, "MMM d, yyyy")}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  To
                </div>
                <div className="text-gray-900 font-medium">
                  {format(endDate, "MMM d, yyyy")}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  Activities
                </div>
                <div className="text-gray-900 font-medium">
                  {trip.dailyActivities?.length || 0} planned
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!showActions ? (
              <Link
                href={`/trips/${trip.id}`}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium shadow-sm">
                View Details
              </Link>
            ) : canEdit ? (
              <>
                <button
                  onClick={() => onUpdate?.(trip)}
                  className="bg-white/80 text-gray-900 hover:bg-white px-6 py-3 rounded-xl transition-all text-sm font-medium shadow-sm">
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(trip.id)}
                  className="bg-red-50/80 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all text-sm font-medium shadow-sm">
                  Delete
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                Created by someone else
              </div>
            )}
          </div>
        </div>
        {trip.tags && trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {trip.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/60 backdrop-blur-sm text-gray-800 text-sm px-4 py-2 rounded-lg font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
