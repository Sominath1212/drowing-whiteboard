import React from "react";

function Navbar() {
     const user = {
       name: "Sominath Girnare",
       avatar: "https://placehold.co/40x40/FF5733/FFFFFF?text=SG", // Placeholder image
     };
  return (
    <nav className="bg-gradient-to-r from-orange-600 to-yellow-500 p-4 shadow-lg ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Application Title */}
        <div className="text-white text-2xl font-bold tracking-wide">
         WB
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              // Fallback for broken image
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/40x40/CCCCCC/000000?text=User";
              }}
            />
          )}
          {user.name && (
            <span className="text-white text-lg font-medium hidden sm:block">
              {user.name}
            </span>
          )}
          {/* You can add more icons or actions here, e.g., settings, logout */}
          {/* Example: A simple settings icon */}
          <button className="text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-2 transition duration-300 ease-in-out">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
