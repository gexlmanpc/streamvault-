const Video = require('../models/Video');
const { cloudinary } = require('../config/cloudinary');

// @GET /api/videos — Get all published videos with filters
exports.getVideos = async (req, res, next) => {
  try {
    const { genre, type, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = { isPublished: true };
    if (genre) query.genre = { $in: [genre] };
    if (type) query.type = type;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      Video.find(query)
        .populate('uploader', 'username avatar')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-videoPublicId'),
      Video.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: videos,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/videos/:id
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar')
      .populate({ path: 'seasons', populate: { path: 'episodes' } });

    if (!video || !video.isPublished) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment view count
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @POST /api/videos — Upload new video (creator/admin only)
exports.createVideo = async (req, res, next) => {
  try {
    const { title, description, type, genre, tags, language, releaseYear, rating } = req.body;

    const videoData = {
      title,
      description,
      type,
      genre: genre ? JSON.parse(genre) : [],
      tags: tags ? JSON.parse(tags) : [],
      language,
      releaseYear,
      rating,
      uploader: req.user._id,
      thumbnail: req.files?.thumbnail?.[0]?.path || '',
    };

    if (req.files?.video?.[0]) {
      videoData.videoUrl = req.files.video[0].path;
      videoData.videoPublicId = req.files.video[0].filename;
    }

    const video = await Video.create(videoData);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/videos/:id
exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this video' });
    }

    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/videos/:id
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    // Delete from Cloudinary
    if (video.videoPublicId) {
      await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
    }

    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
};

// @POST /api/videos/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const isLiked = video.likes.includes(userId);

    await Video.findByIdAndUpdate(req.params.id, {
      [isLiked ? '$pull' : '$addToSet']: { likes: userId },
    });

    res.json({ success: true, liked: !isLiked });
  } catch (error) {
    next(error);
  }
};
