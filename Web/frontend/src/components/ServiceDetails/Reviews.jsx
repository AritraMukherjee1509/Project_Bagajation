import React, { useState } from 'react';
import s from '../../assets/css/components/ServiceDetails/Reviews.module.css';
import { FiStar, FiThumbsUp, FiMessageCircle, FiFilter } from 'react-icons/fi';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    date: '2 days ago',
    rating: 5,
    text: 'Excellent service! Subhajit was very professional and completed the AC installation perfectly. The unit is working great and he explained everything clearly.',
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    date: '1 week ago',
    rating: 5,
    text: 'Very satisfied with the installation service. Quick, clean, and professional work. Highly recommend!',
    helpful: 8,
    verified: true
  },
  {
    id: 3,
    name: 'Amit Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    date: '2 weeks ago',
    rating: 4,
    text: 'Good service overall. The technician was knowledgeable and the installation was done properly. Minor delay in arrival but otherwise great experience.',
    helpful: 5,
    verified: false
  }
];

const ratingBreakdown = [
  { stars: 5, count: 89, percentage: 74 },
  { stars: 4, count: 23, percentage: 19 },
  { stars: 3, count: 6, percentage: 5 },
  { stars: 2, count: 2, percentage: 2 },
  { stars: 1, count: 0, percentage: 0 }
];

export default function Reviews() {
  const [filter, setFilter] = useState('all');
  const [helpfulReviews, setHelpfulReviews] = useState(new Set());

  const toggleHelpful = (reviewId) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h3 className={s.title}>Customer Reviews</h3>
        <div className={s.filterContainer}>
          <FiFilter className={s.filterIcon} />
          <select 
            className={s.filter}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Reviews</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className={s.overview}>
        <div className={s.ratingOverview}>
          <div className={s.averageRating}>
            <span className={s.ratingNumber}>4.8</span>
            <div className={s.ratingStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={s.star} />
              ))}
            </div>
            <span className={s.totalReviews}>Based on 120 reviews</span>
          </div>
        </div>

        <div className={s.ratingBreakdown}>
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className={s.ratingRow}>
              <span className={s.ratingLabel}>{item.stars} star</span>
              <div className={s.ratingBar}>
                <div 
                  className={s.ratingFill}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className={s.ratingCount}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.reviewsList}>
        {filteredReviews.map((review) => (
          <div key={review.id} className={s.reviewItem}>
            <div className={s.reviewHeader}>
              <div className={s.reviewerInfo}>
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className={s.reviewerAvatar}
                />
                <div className={s.reviewerDetails}>
                  <div className={s.reviewerName}>
                    {review.name}
                    {review.verified && (
                      <span className={s.verifiedBadge}>Verified</span>
                    )}
                  </div>
                  <div className={s.reviewDate}>{review.date}</div>
                </div>
              </div>
              
              <div className={s.reviewRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={i < review.rating ? s.starFilled : s.starEmpty} 
                  />
                ))}
              </div>
            </div>

            <p className={s.reviewText}>{review.text}</p>

            <div className={s.reviewActions}>
              <button 
                className={`${s.helpfulBtn} ${helpfulReviews.has(review.id) ? s.helpful : ''}`}
                onClick={() => toggleHelpful(review.id)}
              >
                <FiThumbsUp />
                Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
              </button>
              
              <button className={s.replyBtn}>
                <FiMessageCircle />
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={s.writeReview}>
        <h4 className={s.writeReviewTitle}>Write a Review</h4>
                <p className={s.writeReviewText}>
          Share your experience to help others make informed decisions
        </p>
        <button className={s.writeReviewBtn}>
          Write Review
        </button>
      </div>
    </section>
  );
}