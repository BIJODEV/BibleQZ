import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ 
  title = "BibleQ - Create & Share Bible Quizzes", 
  description = "Create interactive Bible quizzes for your study group. Share links and get real-time results. Perfect for churches, small groups, and personal meditation.",
  keywords = "bible quiz, bible study, scripture quiz, bible meditation, christian app, bible questions",
  image = "/bibleq-og-image.jpg",
  url = "https://bibleq-66551.web.app",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BibleQ" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default MetaTags;