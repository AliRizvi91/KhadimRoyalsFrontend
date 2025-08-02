// Icons
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { MdDownloading } from "react-icons/md";
import { useDispatch } from "react-redux";
import { DeleteMessage } from "@/RTK/Thunks/MessageThunks";

const ClientChatMessage = ({
    smMenu,
    message = "That's awesome. I think our users will really appreciate the improvements.",
    time = "11:46",
    imageUrl,
    MesseageBoxSize,
    senderName,
    recieverId,
    messageId
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch()

    const handleCopy = () => {
        navigator.clipboard.writeText(message).then(() => {
                // Optional: Add some visual feedback that text was copied
                setIsDropdownOpen(false);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
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
        <div className="flex items-start gap-2.5 relative justify-end mb-1">
            {/* Dropdown Button */}

            <div className="flex justify-start items-start">
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        className={`z-10 bg-[#996f53] divide-y manrope divide-gray-100 rounded-lg shadow w-${smMenu}`}
                    >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <button 
                                    onClick={handleCopy}
                                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Copy
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={handleDeleteMsg}
                                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <button
                    id="dropdownMenuIconButton"
                    className="inline-flex self-start items-center p-2 text-sm font-medium cursor-pointer text-center text-white"
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="Message options"
                >
                    <BsThreeDotsVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Message Bubble */}
            <div className="flex flex-col gap-1">
                <div className={`flex flex-col w-full manrope leading-1.5 p-4 border-gray-200 bg-[#ffe2ba] rounded-s-xl rounded-ee-xl ${MesseageBoxSize}`}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <p className="uppercase manrope text-sm font-extrabold">
                            {senderName}
                        </p>
                        <span className="text-sm font-normal text-gray-500">{time}</span>
                    </div>

                    <p className="text-sm font-normal text-gray-900">{message}</p>

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
        </div>
    );
};

export default ClientChatMessage;