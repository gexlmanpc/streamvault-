const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['movie', 'series', 'short'],
      required: true,
    },
    thumbnail: { type: String, required: true },
    bannerImage: { type: String },
    trailerUrl: { type: String },
    genre: [{ type: String }],
    tags: [{ type: String }],
    language: { type: String, default: 'English' },
    releaseYear: { type: Number },
    rating: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-MA', 'TV-14', 'TV-PG'],
    },
    // For movies/shorts — direct video URL
    videoUrl: { type: String },
    videoPublicId: { type: String }, // Cloudinary public_id
    duration: { type: Number }, // in seconds

    // For series
    seasons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Season' }],
    totalEpisodes: { type: Number, default: 0 },

    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ genre: 1, type: 1, isPublished: 1 });

module.exports = mongoose.model('Video', videoSchema);
