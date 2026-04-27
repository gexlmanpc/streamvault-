const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleLike,
} = require('../controllers/videoController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadVideo, uploadImage } = require('../config/cloudinary');
const multer = require('multer');

// Combined upload for video + thumbnail
const upload = multer().fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

router.get('/', getVideos);
router.get('/:id', getVideo);

router.use(protect); // All routes below require auth

router.post('/', restrictTo('creator', 'admin'), upload, createVideo);
router.patch('/:id', restrictTo('creator', 'admin'), updateVideo);
router.delete('/:id', restrictTo('creator', 'admin'), deleteVideo);
router.post('/:id/like', toggleLike);

module.exports = router;
