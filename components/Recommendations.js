"use client";
import React, { useState, useEffect } from "react";
import styles from "./Recommendations.module.css";
import { Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { profile } from "../data/profile";

export default function Recommendations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Shuffle the testimonials on client-side mount to prevent hydration mismatch
    const array = [...profile.testimonials];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setRecommendations(array);
  }, []);

  useEffect(() => {
    if (recommendations.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused, recommendations.length]);

  const handlePrev = () => {
    if (recommendations.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const handleNext = () => {
    if (recommendations.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % recommendations.length);
  };

  if (recommendations.length === 0) {
    return (
      <section id="recommendations" className="section" style={{ position: "relative" }}>
        <div className="container">
          <h2 className="section-title">Client & Manager Recommendations</h2>
          <div className={styles.carouselContainer} style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className={`${styles.recommendationCard} glass-card`} style={{ width: "100%", height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className={styles.loadingText} style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Loading professional recommendations...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="recommendations" className="section" style={{ position: "relative" }}>
      <div className="container">
        <h2 className="section-title">Client & Manager Recommendations</h2>
        
        <div 
          className={styles.carouselContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Arrow */}
          <button className={styles.navButton} onClick={handlePrev} aria-label="Previous recommendation">
            <ChevronLeft size={24} />
          </button>

          {/* Testimonial Card */}
          <div className={`${styles.recommendationCard} glass-card`}>
            <div className={styles.quoteHeader}>
              <Quote className={styles.quoteIcon} size={40} />
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{recommendations[activeIndex].name}</h3>
                <p className={styles.userTitle}>{recommendations[activeIndex].title}</p>
                <p className={styles.relationTag}>{recommendations[activeIndex].relation}</p>
              </div>
            </div>
            
            <p className={styles.quoteText}>"{recommendations[activeIndex].text}"</p>
            
            <div className={styles.cardFooter}>
              <span className={styles.date}>{recommendations[activeIndex].date}</span>
              <span className={styles.verifiedBadge}>
                <MessageSquare size={12} style={{ color: "var(--secondary)", marginRight: "0.25rem" }} />
                LinkedIn Recommendation
              </span>
            </div>
          </div>

          {/* Right Arrow */}
          <button className={styles.navButton} onClick={handleNext} aria-label="Next recommendation">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className={styles.indicators}>
          {recommendations.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
