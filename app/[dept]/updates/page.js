// UpdateLogPage.jsx
import React from "react";

const updates = [
  {
    version: "2025-08-25",
    changes: [
      "Implemented Unit-wise Overtime Summary page with PDF report download functionality.",
    ],
  },
  {
    version: "2025-08-17",
    changes: [
      "Overtime Entry Form date field now displays the full day name with a highlighted blue background.",
      "Resolved an issue that allowed users to submit overtime entries without specifying a unit or work area.",
      "Added descriptive labels to the Overtime Entry Form for better clarity.",
    ],
  },
  {
    version: "2025-08-15",
    changes: [
      "Introduced checkboxes to optionally exclude employees' phone numbers or remarks when generating Holiday Notices.",
      "Holiday Notice now displays employees grouped by their assigned groups.",
      "Added an Authorized Signatory field to the Holiday Notice.",
      "Removed unnecessary menu items from the sidebar for a cleaner interface.",
      "Implemented a new loading animation for the Dashboard.",
      "Non-admin users are now redirected to the Dashboard immediately after login.",
    ],
  },
  {
    version: "2025-08-14",
    changes: [
      "Overtime Type now defaults to 'Weekend' for Fridays and Saturdays.",
      "For 'Holiday' Overtime Type, the entry form now displays a yellow border for emphasis.",
    ],
  },
];

export default function UpdateLogPage() {
  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">Update Log</h1>
        <p className="text-blue-700 mb-8">
          OVERTRACK: ERL Overtime Tracking Web Application.
        </p>

        <div className="space-y-6">
          {updates.map((update, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{update.version}</h2>
                <span className="text-sm text-gray-500">{update.date}</span>
              </div>

              {/* Fixed indentation */}
              <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
                {update.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
