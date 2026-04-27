const express = require('express');
const router = express.Router();
const Episode = require('../models/Episode');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/episodes?series=:id&season=1
router.get('/', async (req, res, next) => {
  try {
    const { series, season } = req.query;
    const query = { isPublished: true };
    if (series) query.series = series;
    if (season) query.seasonNumber = Number(season);

    const episodes = await Episode.find(query).sort({ seasonNumber: 1, episodeNumber: 1 });
    res.json({ success: true, data: episodes });
  } catch (error) {
    next(error);
  }
});

// GET /api/episodes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const episode = await Episode.findById(req.params.id).populate('series', 'title thumbnail');
    if (!episode || !episode.isPublished) {
      return res.status(404).json({ message: 'Episode not found' });
    }
    await Episode.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, data: episode });
  } catch (error) {
    next(error);
  }
});

// POST /api/episodes — Create episode (creator/admin only)
router.post('/', protect, restrictTo('creator', 'admin'), async (req, res, next) => {
  try {
    const episode = await Episode.create(req.body);
    res.status(201).json({ success: true, data: episode });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/episodes/:id
router.patch('/:id', protect, restrictTo('creator', 'admin'), async (req, res, next) => {
  try {
    const episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!episode) return res.status(404).json({ message: 'Episode not found' });
    res.json({ success: true, data: episode });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
