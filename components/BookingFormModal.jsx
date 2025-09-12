import React, { useState } from "react";
import Modal from "./Modal";
import axios from "axios";

const ServiceCard = ({ title, image, onClick }) => (
  <div
    className="cursor-pointer rounded-xl shadow-md w-full relative"
    onClick={() => onClick(title)}
  >
    <img src={image} className="w-full h-full" alt={title} />
  </div>
);

const headers = {
  "Content-Type": "application/json",
  authorization: localStorage.getItem("token"),
};

const services = [
  { title: "Flights", image: "/images/flight.png" },
  { title: "Accommodation", image: "/images/accomodation.png" },
  {
    title: "Land Transportation",
    image: "/images/transportation(land).png",
  },
  { title: "Activity", image: "/images/activity.png" },
  { title: "Flights", image: "/images/flight.png" },
  { title: "Accommodation", image: "/images/accomodation.png" },
  { title: "Flights", image: "/images/flight.png" },
  { title: "Accommodation", image: "/images/accomodation.png" },
];

const BookingFormModal = ({ isOpen, onClose, onSelectedService }) => {
  const handleCardClick = (serviceName) => {
    onSelectedService(serviceName);
    onClose();
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const formValues = Object.fromEntries(formData.entries());

  //   const serviceKey = selectedService?.toLowerCase();

  //   if (!serviceKey) {
  //     console.error("No service selected");
  //     return;
  //   }
  //   // formFields object updated with form data
  //   const formFields = { ...formValues };

  //   const { totalAmount, ...restFields } = formValues;

  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  //   const partyId = user._id || "{}";

  //   const payload = {
  //     quotationType: serviceKey,
  //     channel: "B2C",
  //     partyId: partyId,
  //     formFields: restFields, // dynamic per service
  //     totalAmount,
  //     status: "draft",
  //   };

  //   try {
  //     await axios.post(
  //       "http://localhost:8080/quotation/create-quotation",
  //       payload,
  //       { headers }
  //     );
  //     console.log("Quotation created successfully!", payload);
  //     e.target.reset();
  //   } catch (err) {
  //     console.error("Error creating quotation", err);
  //   }
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Select a Service"}>
      <div className="flex flex-wrap gap-4 justify-center w-[65vw] max-md:w-[100vw]">
        <div className="text-[#6B7280] text-[1rem] text-center w-full mb-2">
          Choose from the range of services provided by{" "}
          <span className="text-[#114958] font-semibold">Karvaann</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {services.map((s) => (
            <ServiceCard
              key={s.title}
              title={s.title}
              image={s.image}
              onClick={() => handleCardClick(s.title)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BookingFormModal;
