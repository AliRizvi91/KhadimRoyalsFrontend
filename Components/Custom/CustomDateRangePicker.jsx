import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import '@/CSS/Calendar.css';
import { BsCalendar2Range } from "react-icons/bs";
import { GetDates } from '@/RTK/Slices/RoomSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setMiniBookedDates } from '@/RTK/Slices/BookSlice';

const CustomDateRangePicker = ({ onDateChange ,currentCategory }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date()));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
    allDates: []
  });

  const { ClassicBookedDates , MiniBookedDates } = useSelector((state) => state.StoreOfBook); // Provide default empty array
  
  const dispatch = useDispatch();

  // Convert ClassicBookedDates strings to Date objects for comparison
  const UserAllbookedDates = currentCategory === '6853f1818ed264b0d5b2c14c' ? MiniBookedDates.map(dateStr => parseISO(dateStr)) : currentCategory === '68552999676c10f45805a5a4' ? ClassicBookedDates.map(dateStr => parseISO(dateStr)) : [];

  
  // Function to check if a date is booked
  const isDateBooked = (date) => {
    return UserAllbookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  // Function to check if a date range contains any booked dates
  const isRangeValid = (start, end) => {
    if (!start || !end) return true;
    const dateRange = eachDayOfInterval({ start, end });
    return !dateRange.some(date => isDateBooked(date));
  };


  useEffect(()=>{
    if(currentCategory=== '6853f1818ed264b0d5b2c14c'){
      dispatch(setMiniBookedDates())
    }
  },[dispatch])

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    // Only update dates if the range doesn't contain any booked dates
    if (isRangeValid(start, end)) {
      setStartDate(start);
      setEndDate(end);

      if (start && end) {
        const dateRange = eachDayOfInterval({ start, end });
        const datesObj = {
          start,
          end,
          allDates: dateRange
        };
        setSelectedDates(datesObj);
        onDateChange(datesObj);

        const serializableDateRange = dateRange.map(date => date.toISOString());
        dispatch(GetDates(serializableDateRange));
      }
    }
  };

  // Custom day class name function
  const getDayClassName = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return 'text-gray-400 cursor-not-allowed';
    }
    if (isDateBooked(date)) {
      return 'bg-red-500 text-white rounded-[2px] cursor-not-allowed';
    }
    if (startDate && endDate && date >= startDate && date <= endDate) {
      return 'bg-blue-500 text-white rounded-[2px]';
    }
    return undefined;
  };

  // Filter out booked dates
  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    // Date should not be booked AND should not be before today
    return !isDateBooked(date) && date >= today;
  };

  const toggleCalendar = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <BsCalendar2Range
        className='text-3xl my-5 cursor-pointer'
        onClick={toggleCalendar}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-[-7.6rem] z-10 mt-2 shadow-lg w-[17rem]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 200
              }
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              monthsShown={2}
              calendarClassName="bg-white p-4 rounded-lg"
              dayClassName={getDayClassName}
              filterDate={filterDate}
              renderCustomHeader={({
                monthDate,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-gray-700">
                    {format(monthDate, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDateRangePicker;