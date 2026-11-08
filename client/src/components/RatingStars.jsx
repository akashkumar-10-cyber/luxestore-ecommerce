import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, showCount = true, size = 'sm' }) => {
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((index) => {
          const filled = rating >= index;
          const half = rating >= index - 0.5 && rating < index;
          return (
            <Star
              key={index}
              className={`${starSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}{' '}
          {numReviews !== undefined && (
            <span className="text-slate-400 font-normal">({numReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
