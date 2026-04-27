const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/watch-history
router.get('/watch-history', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchHistory.video', 'title thumbnail type')
      .populate('watchHistory.episode', 'title thumbnail episodeNumber seasonNumber');
    res.json({ success: true, data: user.watchHistory });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/watch-history — Track episode progress
router.post('/watch-history', protect, async (req, res, next) => {
  try {
    const { videoId, episodeId, progress } = req.body;
    const user = await User.findById(req.user._id);

    const existingIdx = user.watchHistory.findIndex(
      (h) => h.video?.toString() === videoId && h.episode?.toString() === episodeId
    );

    if (existingIdx > -1) {
      user.watchHistory[existingIdx].progress = progress;
      user.watchHistory[existingIdx].watchedAt = new Date();
    } else {
      user.watchHistory.unshift({
        video: videoId,
        episode: episodeId || null,
        progress,
        watchedAt: new Date(),
      });
      // Keep history limited to 100 entries
      if (user.watchHistory.length > 100) user.watchHistory.pop();
    }

    await user.save();
    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/saved
router.get('/saved', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'savedVideos',
      'title thumbnail type genre'
    );
    res.json({ success: true, data: user.savedVideos });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/saved/:videoId — Toggle save
router.post('/saved/:videoId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const isSaved = user.savedVideos.includes(req.params.videoId);

    await User.findByIdAndUpdate(req.user._id, {
      [isSaved ? '$pull' : '$addToSet']: { savedVideos: req.params.videoId },
    });

    res.json({ success: true, saved: !isSaved });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
