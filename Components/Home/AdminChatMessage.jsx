import Image from "next/image";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDownloading } from "react-icons/md";
import { DeleteMessage } from "@/RTK/Thunks/MessageThunks";
import { useDispatch } from "react-redux";


const AdminChatMessage = ({
  smMenu = "44",
  message = "That's awesome. I think our users will really appreciate the improvements.",
  time = "11:46",
  imageUrl = null,
  senderName = "KhadimRoyals",
  MesseageBoxSize,
  recieverId,
  messageId
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch()

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('#dropdownMenuIconButton') && !e.target.closest('.dropdown-menu')) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener when dropdown 
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Copy message to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
        setIsDropdownOpen(false);
        // Optional: Add toast notification or other feedback here
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        // Optional: Show error message to user
      });
  };

  const handleDeleteMsg = async()=>{
    await dispatch(DeleteMessage({
      receiverId:recieverId,
      messageId:messageId
    }))
    setIsDropdownOpen(false);
  }
  return (
    <div className="flex items-start gap-2.5 relative mb-1">
      {/* Message Bubble */}
      <div className="flex flex-col gap-1">
        <div className={`flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-[#E8E4D9] rounded-e-xl rounded-es-xl manrope ${MesseageBoxSize}`}>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <p className="uppercase manrope text-sm font-extrabold">
              {senderName.split(' ')[0]}
              <span className='text-[7px]'>
                {senderName.split(' ').slice(1).join(' ')}
              </span>
            </p>
            <span className="text-sm font-normal text-gray-500">{time}</span>
          </div>
          {message ? (<p className="text-sm font-normal text-gray-900">{message}</p>) : ''}

          {/* Image if provided */}
          {imageUrl && (
            <div className="group relative my-2.5 w-50 h-50 bg-gray-600 overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  data-tooltip-target="download-image"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none focus:ring-gray-50"
                >
                  <MdDownloading className="w-5 h-5 text-white" />
                </button>
              </div>
              <Image
                src={imageUrl}
                alt="Attached content"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Button */}
      <div className="flex justify-start items-center">
        <button
          id="dropdownMenuIconButton"
          className="inline-flex self-start items-center p-2 text-sm font-medium cursor-pointer text-center text-white"
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Message options"
          aria-expanded={isDropdownOpen}
        >
          <BsThreeDotsVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="dropdown-menu z-10 bg-[#996f53] divide-y manrope divide-gray-100 rounded-lg shadow w-15 relative top-5"
            role="menu"
          >
            <ul className="py-2 text-sm text-white" aria-labelledby="dropdownMenuIconButton">
              <li role="menuitem">
                <button 
                  onClick={handleCopy}
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100 hover:text-gray-900"
                >
                  Copy
                </button>
              </li>
              <li role="menuitem">
                <button 
                  onClick={handleDeleteMsg}
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100 hover:text-gray-900"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatMessage;