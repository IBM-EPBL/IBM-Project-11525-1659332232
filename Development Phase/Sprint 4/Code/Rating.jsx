import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ count, rating, color, onRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const getColor = (index) => {
        if(hoverRating >= index)  return color.filled;
        else if(!hoverRating && rating >= index) return color.filled;
        return color.unfilled;
    }

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((index) => (
        <FaStar
          key={index}
          style={{cursor: "pointer", color: getColor(index), fontSize: "25px"}}
          onClick={() => onRating(index)}
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  }, [count, rating, hoverRating]);
  return <div className="text-center">{starRating}</div>;
};

Rating.propTypes = {
  count: PropTypes.number,
  rating: PropTypes.number,
  onChange: PropTypes.func,
  color: {
    filled: PropTypes.string,
    unfilled: PropTypes.string,
  },
};

Rating.defaultProps = {
  count: 5,
  rating: 0,
  color: {
    filled: "orange",
    unfilled: "grey",
  },
};

export default Rating;
