"use client";

import { useState } from "react";
import { DailyActivity, ActivityType } from "../types";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateActivity: (activity: Omit<DailyActivity, "id">) => void;
  tripStartDate: string;
  tripEndDate: string;
}

export default function CreateActivityModal({
  isOpen,
  onClose,
  onCreateActivity,
  tripStartDate,
  tripEndDate,
}: CreateActivityModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    location: "",
    time: "",
    notes: "",
    tags: [] as ActivityType[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateActivity(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
          <h2 className="text-2xl font-bold text-white">Add New Activity</h2>
          <p className="text-green-100 mt-1">Plan your day's activities</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                min={tripStartDate}
                max={tripEndDate}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time (Optional)
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="What are you planning to do?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              rows={3}
              placeholder="Tell us about this activity..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Where will this take place?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              rows={2}
              placeholder="Any additional information..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  "adventure",
                  "culture",
                  "food",
                  "nature",
                  "relaxation",
                  "shopping",
                  "transport",
                ] as ActivityType[]
              ).map((tag) => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={(e) => {
                      const newTags = e.target.checked
                        ? [...formData.tags, tag]
                        : formData.tags.filter((t) => t !== tag);
                      setFormData({ ...formData, tags: newTags });
                    }}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm capitalize text-gray-700">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-lg hover:shadow-xl">
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
