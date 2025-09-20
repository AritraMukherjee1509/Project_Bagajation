const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { uploadImage, deleteImage, uploadMultipleImages } = require('../config/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    let query = Service.find({ status: 'active' });

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      });
    }

    // Category filter
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
      query = query.find({ 'pricing.basePrice': priceFilter });
    }

    // Rating filter
    if (req.query.rating) {
      query = query.find({ 'ratings.averageRating': { $gte: parseFloat(req.query.rating) } });
    }

    // Location filter
    if (req.query.city) {
      query = query.find({ 'serviceArea.cities': { $in: [req.query.city] } });
    }

    // Provider filter
    if (req.query.provider) {
      query = query.find({ provider: req.query.provider });
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query = query.find({ featured: true });
    }

    // Popular filter
    if (req.query.popular === 'true') {
      query = query.find({ popular: true });
    }

    // Availability filter
    if (req.query.available === 'true') {
      query = query.find({ 'availability.isAvailable': true });
    }

    // Sort
    let sortBy = req.query.sort || '-createdAt';
    
    // Custom sort options
    if (req.query.sort === 'price-low') sortBy = 'pricing.basePrice';
    if (req.query.sort === 'price-high') sortBy = '-pricing.basePrice';
    if (req.query.sort === 'rating') sortBy = '-ratings.averageRating';
    if (req.query.sort === 'popular') sortBy = '-stats.totalBookings';

    query = query.sort(sortBy);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Service.countDocuments(query.getQuery());

    query = query.skip(startIndex).limit(limit);

    // Populate provider details
    query = query.populate({
      path: 'provider',
      select: 'name ratings verification status businessInfo'
    });

    // Execute query
    const services = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      pagination,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate({
        path: 'provider',
        select: 'name ratings verification businessInfo experience certifications'
      })
      .populate({
        path: 'reviews',
        select: 'user rating comment breakdown createdAt helpful',
        populate: {
          path: 'user',
          select: 'name avatar'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment view count
    await Service.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.viewCount': 1 }
    });

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/v1/services
// @access  Private/Provider/Admin
const createService = async (req, res, next) => {
  try {
    // Set provider from authenticated user if not admin
    if (!req.admin && req.provider) {
      req.body.provider = req.provider.id;
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      try {
        const uploadResults = await uploadMultipleImages(
          req.files.map(file => file.path),
          'services'
        );
        
        req.body.images = uploadResults.map((result, index) => ({
          public_id: result.public_id,
          url: result.url,
          alt: req.files[index].originalname
        }));
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    const service = await Service.create(req.body);

    // Populate provider details
    await service.populate('provider', 'name businessInfo');

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private/Provider/Admin
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership (provider can only update their own services)
    if (!req.admin && req.provider && service.provider.toString() !== req.provider.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      try {
        // Delete old images if replacing
        if (req.body.replaceImages === 'true' && service.images.length > 0) {
          for (const image of service.images) {
            if (image.public_id) {
              await deleteImage(image.public_id);
            }
          }
        }

        const uploadResults = await uploadMultipleImages(
          req.files.map(file => file.path),
          'services'
        );
        
        const newImages = uploadResults.map((result, index) => ({
          public_id: result.public_id,
          url: result.url,
          alt: req.files[index].originalname
        }));

        if (req.body.replaceImages === 'true') {
          req.body.images = newImages;
        } else {
          req.body.images = [...service.images, ...newImages];
        }
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('provider', 'name businessInfo');

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private/Provider/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (!req.admin && req.provider && service.provider.toString() !== req.provider.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if service has active bookings
    const activeBookings = await Booking.countDocuments({
      service: service._id,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete service with active bookings'
      });
    }

    // Delete images from cloudinary
    if (service.images && service.images.length > 0) {
      for (const image of service.images) {
        if (image.public_id) {
          try {
            await deleteImage(image.public_id);
          } catch (deleteError) {
            console.error('Error deleting image:', deleteError);
          }
        }
      }
    }

    // Soft delete - change status to inactive
    service.status = 'inactive';
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get services by category
// @route   GET /api/v1/services/category/:category
// @access  Public
const getServicesByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const services = await Service.find({ 
      category, 
      status: 'active',
      'availability.isAvailable': true 
    })
      .populate('provider', 'name ratings verification')
      .sort('-ratings.averageRating')
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments({ 
      category, 
      status: 'active',
      'availability.isAvailable': true 
    });

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured services
// @route   GET /api/v1/services/featured
// @access  Public
const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ 
      featured: true, 
      status: 'active',
      'availability.isAvailable': true 
    })
      .populate('provider', 'name ratings verification')
      .sort('-ratings.averageRating')
      .limit(12);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular services
// @route   GET /api/v1/services/popular
// @access  Public
const getPopularServices = async (req, res, next) => {
  try {
    const services = await Service.find({ 
      status: 'active',
      'availability.isAvailable': true 
    })
      .populate('provider', 'name ratings verification')
      .sort('-stats.totalBookings')
      .limit(12);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service analytics
// @route   GET /api/v1/services/:id/analytics
// @access  Private/Provider/Admin
const getServiceAnalytics = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (!req.admin && req.provider && service.provider.toString() !== req.provider.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get analytics data
    const [bookingStats, revenueStats, ratingStats] = await Promise.all([
      // Booking statistics
      Booking.aggregate([
        { $match: { service: mongoose.Types.ObjectId(req.params.id) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.totalAmount' }
          }
        }
      ]),

      // Monthly revenue
      Booking.aggregate([
        { 
          $match: { 
            service: mongoose.Types.ObjectId(req.params.id),
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$pricing.totalAmount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),

      // Rating distribution
      Review.aggregate([
        { $match: { service: mongoose.Types.ObjectId(req.params.id) } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        service,
        bookingStats,
        revenueStats,
        ratingStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search services
// @route   GET /api/v1/services/search
// @access  Public
const searchServices = async (req, res, next) => {
  try {
    const { q, location, category, minPrice, maxPrice, rating } = req.query;

    let query = Service.find({ status: 'active' });

    // Text search
    if (q) {
      query = query.find({
        $text: { $search: q }
      });
    }

    // Location-based search
    if (location) {
      query = query.find({
        $or: [
          { 'serviceArea.cities': { $regex: location, $options: 'i' } },
          { 'serviceArea.states': { $regex: location, $options: 'i' } }
        ]
      });
    }

    // Apply other filters
    if (category) query = query.find({ category });
    if (minPrice) query = query.find({ 'pricing.basePrice': { $gte: parseFloat(minPrice) } });
    if (maxPrice) query = query.find({ 'pricing.basePrice': { $lte: parseFloat(maxPrice) } });
    if (rating) query = query.find({ 'ratings.averageRating': { $gte: parseFloat(rating) } });

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await Service.countDocuments(query.getQuery());
    
    const services = await query
      .populate('provider', 'name ratings verification')
      .sort(q ? { score: { $meta: 'textScore' } } : '-ratings.averageRating')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getFeaturedServices,
  getPopularServices,
  getServiceAnalytics,
  searchServices
};