const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Episode title is required'],
      trim: true,
    },
    description: { type: String },
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    seasonNumber: { type: Number, required: true },
    episodeNumber: { type: Number, required: true },
    thumbnail: { type: String },
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String },
    duration: { type: Number }, // in seconds
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    airDate: { type: Date },
  },
  { timestamps: true }
);

episodeSchema.index({ series: 1, seasonNumber: 1, episodeNumber: 1 });

module.exports = mongoose.model('Episode', episodeSchema);
