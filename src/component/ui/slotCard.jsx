import React, { useState } from "react";
import Colors from "../../core/constant";

const days = [
  { label: "Fri", date: "18", recommended: true },
  { label: "Sat", date: "19", recommended: false },
  { label: "Sun", date: "20", recommended: false },
];

const timeSlots = [
  { time: "06:30 PM" },
  { time: "07:00 PM" },
  { time: "07:30 PM" },
];

const SlotCard = ({ onSelectSlot }) => {
  const [selectedDay, setSelectedDay] = useState("18");
  const [selectedTime, setSelectedTime] = useState("06:30 PM");

  const handleProceed = () => {
    const selectedDayObj = days.find((day) => day.date === selectedDay);
    onSelectSlot({ day: selectedDayObj, time: selectedTime });
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto font-sans transition-all duration-300 hover:shadow-2xl">
      <h2
        className={`text-2xl font-bold mb-6 bg-${Colors.primaryMain} bg-clip-text text-transparent`}
      >
        When should the professional arrive?
      </h2>

      {/* Schedule for later */}
      <div className="border border-gray-100 rounded-xl p-5 mb-6 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Schedule for later
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select your preferred day & time
        </p>

        {/* Day Selector */}
        <div className="flex space-x-4 mb-6">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className={`flex flex-col items-center px-5 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                selectedDay === day.date
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                  : "border-gray-200 text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-semibold">{day.label}</span>
              <span className="text-lg font-bold">{day.date}</span>
              {day.recommended && (
                <span className="text-xs text-orange-500 mt-1 animate-pulse">
                  ★ Recommended
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Time Slot Selector */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-3">
            Select start time of service
          </h4>
          <div className="flex flex-wrap gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={`px-5 py-2.5 rounded-lg border flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                  selectedTime === slot.time
                    ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                    : "border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className={`w-full py-3 px-4 bg-${Colors.primaryMain} text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
      >
        Proceed
      </button>
    </div>
  );
};

export default SlotCard;

// import React, { useState, useEffect } from "react";
// import { format, addDays, addMinutes, isAfter, startOfDay } from "date-fns";
// import { Calendar, Clock, ChevronRight } from "lucide-react";
// import Colors from "../../core/constant";

// const SlotCard = ({ onSelectSlot }) => {
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [days, setDays] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);

//   useEffect(() => {
//     const now = new Date();
//     const tomorrow = addDays(now, 1);

//     // Generate next 3 days
//     const dynamicDays = Array.from({ length: 3 }, (_, i) => {
//       const dayDate = addDays(tomorrow, i);
//       return {
//         label: format(dayDate, "EEE"),
//         date: format(dayDate, "d"),
//         month: format(dayDate, "MMM"),
//         fullDate: format(dayDate, "yyyy-MM-dd"),
//         recommended: i === 0,
//       };
//     });
//     setDays(dynamicDays);
//     setSelectedDay(dynamicDays[0]?.date);

//     // Generate 3 upcoming time slots (30-min intervals, 6 PM onwards)
//     const slots = [];
//     let baseTime = new Date(now);
//     baseTime.setHours(18, 0, 0, 0); // Start from 6 PM

//     if (baseTime <= now) {
//       const minutes = Math.ceil((now.getMinutes() + 1) / 30) * 30;
//       baseTime.setMinutes(minutes);
//       if (baseTime.getMinutes() === 0)
//         baseTime.setHours(baseTime.getHours() + 1);
//     }

//     while (slots.length < 3) {
//       if (baseTime.getHours() >= 22) {
//         baseTime = addDays(startOfDay(baseTime), 1);
//         baseTime.setHours(18, 0, 0, 0);
//       }
//       if (isAfter(baseTime, now)) {
//         slots.push({
//           time: format(baseTime, "h:mm a"),
//           fullTime: format(baseTime, "HH:mm"),
//         });
//       }
//       baseTime = addMinutes(baseTime, 30);
//     }

//     setTimeSlots(slots);
//     setSelectedTime(slots[0]?.time);
//   }, []);

//   const handleProceed = () => {
//     const dayObj = days.find((d) => d.date === selectedDay);
//     const timeObj = timeSlots.find((t) => t.time === selectedTime);
//     onSelectSlot({ day: dayObj, time: timeObj });
//   };

//   if (!days.length || !timeSlots.length) {
//     return (
//       <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
//         <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
//         <div className="space-y-4">
//           <div className="h-20 bg-gray-100 rounded-xl"></div>
//           <div className="h-12 bg-gray-100 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-md mx-auto font-sans hover:shadow-2xl transition-shadow duration-300">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-7">
//         <div className="p-3 bg-orange-100 rounded-xl">
//           <Calendar className="w-6 h-6 text-orange-600" />
//         </div>
//         <h2
//           className={`text-2xl font-bold bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent`}
//         >
//           Schedule Your Service
//         </h2>
//       </div>

//       {/* Day Selection */}
//       <div className="mb-7">
//         <div className="flex items-center gap-2 mb-4">
//           <Clock className="w-5 h-5 text-gray-600" />
//           <h3 className="text-lg font-semibold text-gray-900">Choose a Date</h3>
//         </div>
//         <div className="grid grid-cols-3 gap-3">
//           {days.map((day) => (
//             <button
//               key={day.date}
//               onClick={() => setSelectedDay(day.date)}
//               className={`
//                 relative p-4 rounded-xl border-2 transition-all duration-300
//                 ${
//                   selectedDay === day.date
//                     ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
//                     : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                 }
//               `}
//             >
//               <div className="text-center">
//                 <p className="text-xs text-gray-500 uppercase">{day.month}</p>
//                 <p
//                   className={`text-2xl font-bold ${
//                     selectedDay === day.date
//                       ? "text-orange-600"
//                       : "text-gray-900"
//                   }`}
//                 >
//                   {day.date}
//                 </p>
//                 <p className="text-xs font-medium text-gray-600">{day.label}</p>
//               </div>
//               {day.recommended && (
//                 <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
//                   Recommended
//                 </div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Time Selection */}
//       <div className="mb-8">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//           <Clock className="w-5 h-5 text-gray-600" />
//           Preferred Time
//         </h4>
//         <div className="grid grid-cols-3 gap-3">
//           {timeSlots.map((slot) => (
//             <button
//               key={slot.time}
//               onClick={() => setSelectedTime(slot.time)}
//               className={`
//                 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all duration-300
//                 ${
//                   selectedTime === slot.time
//                     ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
//                     : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
//                 }
//               `}
//             >
//               {slot.time}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Proceed Button */}
//       <button
//         onClick={handleProceed}
//         className={`
//           w-full py-4 px-6 rounded-xl font-bold text-white
//           bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo}
//           hover:shadow-lg transform hover:scale-[1.02] active:scale-95
//           transition-all duration-300 flex items-center justify-center gap-2
//           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
//         `}
//         disabled={!selectedDay || !selectedTime}
//       >
//         Proceed to Checkout
//         <ChevronRight className="w-5 h-5" />
//       </button>

//       {/* Subtle hint */}
//       <p className="text-xs text-gray-500 text-center mt-4">
//         Service starts at selected time • Professional arrives within 30 mins
//       </p>
//     </div>
//   );
// };

// export default SlotCard;
