"use client";
import React from "react";

const Table = ({ data, columns }) => {
  console.log("Table Data Inside Table:", data);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  console.log("Paginated Rows:", paginatedRows);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#155e75] text-white">
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-3 font-semibold text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {row}
              </tr>
            ))}
            {/* Fill empty rows to keep table height consistent */}
            {Array.from({
              length: Math.max(0, rowsPerPage - paginatedRows.length),
            }).map((_, idx) => (
              <tr
                key={`empty-${idx}`}
                className={`${
                  (paginatedRows.length + idx) % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } h-14`}
              >
                <td className="px-4 py-3" colSpan={8}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Rows per page:</span>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-gray-600 bg-white"
            value={rowsPerPage}
            readOnly
          >
            <option>{rowsPerPage}</option>
          </select>
        </div>
        <div className="text-gray-600">
          Showing {(page - 1) * rowsPerPage + 1}-
          {Math.min(page * rowsPerPage, totalRows)} of {totalRows} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#155e75]"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded-full font-bold border border-gray-300 flex items-center justify-center ${
                page === idx + 1
                  ? "bg-[#155e75] text-white"
                  : "bg-white text-[#155e75]"
              }`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#155e75]"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
