import React from "react";
import Colors from "../../core/constant";

const StarRating = ({ rating }) => {
  const numericRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 transition-colors duration-200"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.27 8.384c-.784-.57-.382-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 transition-colors duration-200"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927v14.146l3.357-2.44c.784-.57 1.839.197 1.539 1.118l-1.287-3.957a1 1 0 01.364-1.118l3.357-2.44c.783-.57.381-1.81-.588-1.81h-4.162a1 1 0 01-.95-.69L9.049 2.927z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 transition-colors duration-200"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.420 2.492a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.42-2.495a1 1 0 00-1.175 0l-3.42 2.495c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.42-2.492c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
      <span className="ml-2 text-gray-600 text-xs sm:text-sm font-medium">
        {numericRating.toFixed(1)}
      </span>
    </div>
  );
};

const RatingScreen = ({ reviews }) => {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + parseFloat(review.Rating), 0) /
          reviews.length
        ).toFixed(1)
      : "No ratings";

  const ReviewCard = ({ review, isMobile = false }) => (
    <div
      className={`${
        isMobile ? "w-80 p-3" : "p-4"
      } border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div
        className={`flex items-start justify-between mb-3 ${
          isMobile ? "flex-col space-y-2" : ""
        }`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={review.image || "/default-avatar.png"}
            alt={review.Name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
          <span
            className={`font-semibold text-gray-800 ${
              isMobile ? "text-sm" : "text-sm sm:text-base"
            } truncate`}
          >
            {review.Name}
          </span>
        </div>
        {!isMobile && (
          <div className="flex-shrink-0 ml-2">
            <StarRating rating={review.Rating} />
          </div>
        )}
      </div>
      <p
        className={`text-gray-600 ${
          isMobile ? "text-xs" : "text-xs sm:text-sm"
        } leading-relaxed break-words`}
      >
        {review.Review}
      </p>
      {isMobile && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <StarRating rating={review.Rating} />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-4 sm:p-6 max-w-7xl mx-auto">
      <h3
        className={`text-lg sm:text-xl md:text-2xl font-semibold text-${Colors.primaryMain} mb-4`}
      >
        Reviews
      </h3>

      {/* Average rating */}
      <div className="flex items-center justify-center sm:justify-start mb-6">
        {averageRating === "No ratings" ? (
          <p className="text-gray-600 text-sm font-medium">No ratings yet</p>
        ) : (
          <StarRating rating={averageRating} />
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No reviews available.</p>
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal scrollable cards */}
          <div className="block sm:hidden">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {reviews.map((review) => (
                <ReviewCard key={review.ID} review={review} isMobile={true} />
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          {/* Desktop: Show 3 reviews and make scrollable if more */}
          <div className="hidden sm:block">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {reviews.map((review) => (
                <div
                  key={review.ID}
                  className="flex-shrink-0 snap-start w-[32%] min-w-[300px]" // each card takes ~1/3 of width
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RatingScreen;
