import React from "react";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaArrowCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

const SummaryCards = () => {
  return (
    <>
      {/* Summary Cards Section */}
      <div className="flex flex-col md:flex-row mb-8 mx-[-2px] mt-8">
        {/* Total Card */}
        <div className="bg-white border border-blue-100 rounded-2xl shadow p-4 flex flex-col justify-between w-[400px] min-w-[220px] md:mr-[140px]">
          <span className="text-gray-500 text-lg mb-2">Total</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-[#114958]">
              ₹ 12,45,890
            </span>
            <div className="bg-blue-100 rounded-full p-3">
              <RiExchangeDollarLine className="text-[#114958]" size={23} />
            </div>
          </div>
          <span className="text-green-600 mt-2 font-medium">
            +8.5% from last month
          </span>
        </div>

        <div className="flex gap-4 ml-auto">
          {/* You Give Card */}
          <div className="bg-white border border-red-100 rounded-2xl shadow p-4 flex flex-col justify-between w-[280px] min-w-[120px] md:mr-6">
            <span className="text-gray-500 text-lg mb-2">You Give</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-black">₹ 8,45,620</span>
              <div className="bg-red-100 rounded-full p-3">
                <FaArrowCircleLeft className="text-red-500" size={20} />
              </div>
            </div>
            <span className="text-red-500 mt-2 font-medium">
              -3.2% from last month
            </span>
          </div>
          {/* You Get Card */}
          <div className="bg-white border border-green-100 rounded-2xl shadow p-4 flex flex-col justify-between w-[280px] min-w-[120px]">
            <span className="text-gray-500 text-lg mb-2">You Get</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-black">₹ 4,00,270</span>
              <div className="bg-green-100 rounded-full p-3">
                <FaRegArrowAltCircleRight
                  className="text-green-500"
                  size={20}
                />
              </div>
            </div>
            <span className="text-green-600 mt-2 font-medium">
              +12.3% from last month
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryCards;
