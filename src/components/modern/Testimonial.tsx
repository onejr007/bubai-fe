import React from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
}) => {
  return (
    <div className="testimonial-card glass hover-lift">
      <div className="testimonial-quote">
        <span className="quote-mark">"</span>
        <p>{quote}</p>
      </div>
      
      {rating && (
        <div className="testimonial-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
              ★
            </span>
          ))}
        </div>
      )}
      
      <div className="testimonial-author">
        {avatar && (
          <img src={avatar} alt={author} className="author-avatar" />
        )}
        <div className="author-info">
          <div className="author-name">{author}</div>
          <div className="author-role">{role}</div>
        </div>
      </div>
    </div>
  );
};
