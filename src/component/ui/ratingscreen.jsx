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
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.27 8.384c-.784-.57-.382-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927v14.146l3.357-2.44c.784-.57 1.839.197 1.539 1.118l-1.287-3.957a1 1 0 01.364-1.118l3.357-2.44c.783-.57.381-1.81-.588-1.81h-4.162a1 1 0 01-.95-.69L9.049 2.927z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.27 8.384c-.784-.57-.382-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      <span className="ml-2 text-gray-600 text-sm">
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

  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 max-w-7xl mx-auto">
      <h3
        className={`text-xl md:text-2xl font-semibold text-${Colors.primaryMain} mb-4`}
      >
        Reviews
      </h3>

      {/* Average rating */}
      <div className="flex items-center mb-6">
        {averageRating === "No ratings" ? (
          <p className="text-gray-600 text-sm">No ratings yet</p>
        ) : (
          <StarRating rating={averageRating} />
        )}
      </div>

      {/* Scrollable reviews (5 visible at once) */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
        {reviews.map((review) => (
          <div
            key={review.ID}
            className="flex-shrink-0 snap-center w-[33.3333%] md:w-1/3 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={review.image || "/default-avatar.png"}
                  alt={review.Name}
                  className="w-10 h-10 rounded-full border object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
                <span className="font-semibold text-gray-800">
                  {review.Name}
                </span>
              </div>
              <StarRating rating={review.Rating} />
            </div>
            <p className="text-gray-600 mt-2 text-sm">{review.Review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingScreen;
