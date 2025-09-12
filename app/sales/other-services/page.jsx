import Filter from "../../../components/Filter";
import SummaryCards from "../../../components/SummaryCards";
import Table from "../../../components/Table";

const OSSalesPage = () => {
  const columns = [
    "#ID",
    "Lead Pax",
    "Travel Date",
    "Service",
    "Booking Status",
    "Amount",
    "Voucher",
    "Tasks",
  ];

  const data = [
    [
      <td className="px-4 py-3">#001</td>,
      <td className="px-4 py-3">Anand Mishra</td>,
      <td className="px-4 py-3">12-09-2025</td>,
      <td className="px-4 py-3">✈️ Flight</td>,
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Successful
        </span>
      </td>,
      <td className="px-4 py-3">₹ 24,580</td>,
      <td className="px-4 py-3">📄</td>,
      <td className="px-4 py-3">3</td>,
    ],
    [
      <td className="px-4 py-3">#002</td>,
      <td className="px-4 py-3">Sumit Jha</td>,
      <td className="px-4 py-3">15-09-2025</td>,
      <td className="px-4 py-3">🏨 Accommodation</td>,
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
          In Progress
        </span>
      </td>,
      <td className="px-4 py-3">₹ 24,580</td>,
      <td className="px-4 py-3">📄</td>,
      <td className="px-4 py-3">3</td>,
    ],
    [
      <td className="px-4 py-3">#003</td>,
      <td className="px-4 py-3">Deepanshu</td>,
      <td className="px-4 py-3">18-09-2025</td>,
      <td className="px-4 py-3">🚢 Transportation (Maritime)</td>,
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          Failed
        </span>
      </td>,
      <td className="px-4 py-3">₹ 24,580</td>,
      <td className="px-4 py-3">📄</td>,
      <td className="px-4 py-3">3</td>,
    ],
    [
      <td className="px-4 py-3">#004</td>,
      <td className="px-4 py-3">Zaheer</td>,
      <td className="px-4 py-3">20-09-2025</td>,
      <td className="px-4 py-3">🚌 Transportation (Land)</td>,
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Successful
        </span>
      </td>,
      <td className="px-4 py-3">₹ 24,580</td>,
      <td className="px-4 py-3">📄</td>,
      <td className="px-4 py-3">1</td>,
    ],
    [
      <td className="px-4 py-3">#005</td>,
      <td className="px-4 py-3">Gaurav Kapoor</td>,
      <td className="px-4 py-3">22-09-2025</td>,
      <td className="px-4 py-3">✈️ Flight</td>,
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
          On Hold
        </span>
      </td>,
      <td className="px-4 py-3">₹ 24,580</td>,
      <td className="px-4 py-3">📄</td>,
      <td className="px-4 py-3">3</td>,
    ],
  ];
  return (
    <>
      <div className="flex justify-end gap-4 p-6 w-full mx-[10px] mt-[-15px]">
        <button className="bg-white text-[#114958] px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
          View Draft
        </button>
        <button className="bg-[#114958] text-white px-6 py-2 rounded-lg shadow hover:bg-[#14505e] transition">
          Create +
        </button>
      </div>
      <div className=" min-h-screen ml-20 mt-2 ">
        <Filter />
        <SummaryCards />
        <Table data={data} columns={columns} />
      </div>
    </>
  );
};

export default OSSalesPage;
