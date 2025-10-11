import React, { useState } from "react";

interface RoomSegment {
  id?: string | null;
  roomCategory: string;
  bedType: string;
}

interface HotelLayoutProps {
  segments: RoomSegment[];
  onSegmentsChange: (segments: RoomSegment[]) => void;
}

const HotelLayout: React.FC<HotelLayoutProps> = ({
  segments,
  onSegmentsChange,
}) => {
  const [numRooms, setNumRooms] = useState(segments.length);
  const [copyToOthers, setCopyToOthers] = useState(false);

  // Internal state for pax information (not stored in context)
  const [paxData, setPaxData] = useState<
    Record<string, { adults: number; children: number; infant: number }>
  >(() => {
    const initial: Record<
      string,
      { adults: number; children: number; infant: number }
    > = {};
    segments.forEach((seg, idx) => {
      initial[seg.id || `room-${idx + 1}`] = {
        adults: 1,
        children: 0,
        infant: 0,
      };
    });
    return initial;
  });

  // Handle room count change
  const handleRoomCountChange = (newCount: number) => {
    if (newCount < 1) return;

    setNumRooms(newCount);

    if (newCount > segments.length) {
      // Add new rooms
      const newSegments: RoomSegment[] = [...segments];
      const newPaxData = { ...paxData };

      for (let i = segments.length; i < newCount; i++) {
        const roomId = `room-${i + 1}`;
        newSegments.push({
          id: roomId,
          roomCategory:
            copyToOthers && segments[0] ? segments[0].roomCategory : "",
          bedType: copyToOthers && segments[0] ? segments[0].bedType : "",
        });

        const basePax =
          copyToOthers && segments[0]
            ? paxData[segments[0].id || "room-1"]
            : undefined;

        newPaxData[roomId] = {
          adults: basePax?.adults ?? 1,
          children: basePax?.children ?? 0,
          infant: basePax?.infant ?? 0,
        };
      }

      setPaxData(newPaxData);
      onSegmentsChange(newSegments);
    } else if (newCount < segments.length) {
      // Remove rooms
      const newSegments = segments.slice(0, newCount);
      const newPaxData = { ...paxData };

      // Remove pax data for deleted rooms
      segments.slice(newCount).forEach((seg) => {
        delete newPaxData[seg.id || ""];
      });

      setPaxData(newPaxData);
      onSegmentsChange(newSegments);
    }
  };

  // Handle segment update
  const updateSegment = (
    index: number,
    field: keyof RoomSegment,
    value: string
  ) => {
    const newSegments: RoomSegment[] = segments.map((seg, idx) => {
      if (idx === index) {
        return {
          ...seg,
          [field]: value,
        };
      }

      // If copy to others is enabled and updating first room
      if (
        copyToOthers &&
        index === 0 &&
        (field === "roomCategory" || field === "bedType")
      ) {
        return {
          ...seg,
          [field]: value,
        };
      }

      return seg;
    });

    onSegmentsChange(newSegments);
  };

  const updatePaxCount = (
    roomId: string,
    field: "adults" | "children" | "infant",
    increment: boolean
  ) => {
    setPaxData((prev) => {
      const current = prev[roomId] || { adults: 0, children: 0, infant: 0 };
      const newValue = increment
        ? current[field] + 1
        : Math.max(0, current[field] - 1);

      return {
        ...prev,
        [roomId]: {
          adults: field === "adults" ? newValue : current.adults,
          children: field === "children" ? newValue : current.children,
          infant: field === "infant" ? newValue : current.infant,
        },
      };
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Room Counter */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Rooms
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={numRooms}
            onChange={(e) =>
              handleRoomCountChange(parseInt(e.target.value) || 1)
            }
            className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            min="1"
          />
          <div className="flex flex-col">
            <button
              onClick={() => handleRoomCountChange(numRooms + 1)}
              className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 rounded-t-md"
            >
              ▲
            </button>
            <button
              onClick={() => handleRoomCountChange(numRooms - 1)}
              className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 rounded-b-md border-t-0"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Room Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((segment, index) => {
          const roomId = segment.id || `room-${index + 1}`;
          const pax = paxData[roomId] || { adults: 1, children: 0, infant: 0 };

          return (
            <div
              key={roomId}
              className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Room {index + 1}
                </h3>
                {index === 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyToOthers}
                      onChange={(e) => setCopyToOthers(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Copy to Other Rooms
                  </label>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Category
                </label>
                <input
                  type="text"
                  value={segment.roomCategory}
                  onChange={(e) =>
                    updateSegment(index, "roomCategory", e.target.value)
                  }
                  placeholder="Enter Room Category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Type
                </label>
                <input
                  type="text"
                  value={segment.bedType}
                  onChange={(e) =>
                    updateSegment(index, "bedType", e.target.value)
                  }
                  placeholder="Enter Bed Type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pax Section */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pax
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Adults
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updatePaxCount(roomId, "adults", false)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={pax.adults}
                        readOnly
                        className="w-full text-right border-x border-gray-300 py-2"
                      />
                      <button
                        onClick={() => updatePaxCount(roomId, "adults", true)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Children
                    </label>
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => updatePaxCount(roomId, "children", true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Infant
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updatePaxCount(roomId, "infant", false)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={pax.infant}
                        readOnly
                        className="w-full text-right border-x border-gray-300 py-2"
                      />
                      <button
                        onClick={() => updatePaxCount(roomId, "infant", true)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelLayout;
