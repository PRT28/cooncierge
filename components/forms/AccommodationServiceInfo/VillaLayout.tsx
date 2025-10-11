import React, { useState } from "react";

interface RoomSegment {
  id?: string | null;
  roomCategory: string;
  bedType: string;
}

interface VillaLayoutProps {
  segments: RoomSegment[];
  onSegmentsChange: (segments: RoomSegment[]) => void;
}

const VillaLayout: React.FC<VillaLayoutProps> = ({
  segments,
  onSegmentsChange,
}) => {
  const [numRooms, setNumRooms] = useState(segments.length);
  const [roomcount, setRoomcount] = useState(0);
  const [copyToOthers, setCopyToOthers] = useState(false);
  const [villaType, setVillaType] = useState<"entire" | "shared">("entire");

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
    <>
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Total Rooms
      </label>
      <div className="flex gap-60">
        {/* Entire Villa Room Counter */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                value={roomcount}
                onChange={(e) => setRoomcount(parseInt(e.target.value) || 0)}
                className="w-16 py-1 text-center border-none focus:outline-none focus:ring-0"
                min="1"
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setRoomcount(roomcount + 1)}
                  className="w-8 h-6 flex items-center justify-center bg-white hover:bg-gray-100"
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <span style={{ fontSize: "18px", lineHeight: "1" }}>▲</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoomcount(roomcount - 1)}
                  className="w-8 h-6 flex items-center justify-center bg-white hover:bg-gray-100"
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                >
                  <span style={{ fontSize: "18px", lineHeight: "1" }}>▼</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Villa Type radio buttons */}
        <div className="flex items-center space-x-6 ml-60">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="villaType"
              value="entire"
              checked={villaType === "entire"}
              onChange={() => setVillaType("entire")}
              className="form-radio text-blue-600 focus:ring-0"
            />
            <span className="text-gray-700 font-medium">Entire Villa</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="villaType"
              value="shared"
              checked={villaType === "shared"}
              onChange={() => setVillaType("shared")}
              className="form-radio text-blue-600 focus:ring-0"
            />
            <span className="text-gray-700 font-medium">Shared Villa</span>
          </label>
        </div>
      </div>

      {villaType === "shared" && (
        <div className="w-full max-w-6xl mx-auto p-6 mt-2">
          {/* Room Counter */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              No. of Rooms
            </label>
            <div className="flex items-center">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={numRooms}
                  onChange={(e) =>
                    handleRoomCountChange(parseInt(e.target.value) || 1)
                  }
                  className="w-16 py-1 text-center border-none focus:outline-none focus:ring-0"
                  min="1"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleRoomCountChange(numRooms + 1)}
                    className="w-8 h-6 flex items-center justify-center bg-white hover:bg-gray-100"
                    style={{
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <span style={{ fontSize: "18px", lineHeight: "1" }}>▲</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoomCountChange(numRooms - 1)}
                    className="w-8 h-6 flex items-center justify-center bg-white hover:bg-gray-100"
                    style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  >
                    <span style={{ fontSize: "18px", lineHeight: "1" }}>▼</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Room Segments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {segments.map((segment, index) => {
              const roomId = segment.id || `room-${index + 1}`;
              const pax = paxData[roomId] || {
                adults: 1,
                children: 0,
                infant: 0,
              };

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
                      placeholder="Super Deluxe"
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
                      placeholder="King Size Bed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                            onClick={() =>
                              updatePaxCount(roomId, "adults", false)
                            }
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
                            onClick={() =>
                              updatePaxCount(roomId, "adults", true)
                            }
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
                            onClick={() =>
                              updatePaxCount(roomId, "children", true)
                            }
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
                            onClick={() =>
                              updatePaxCount(roomId, "infant", false)
                            }
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
                            onClick={() =>
                              updatePaxCount(roomId, "infant", true)
                            }
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
      )}
    </>
  );
};

export default VillaLayout;
