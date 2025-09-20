const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  password: body('password')
    .isLength({ min: 6, max: 50 })
    .withMessage('Password must be between 6 and 50 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  phone: body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
    
  name: body('name')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Name must be between 2 and 50 characters'),
    
  objectId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  rating: body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
    
  price: body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  coordinates: [
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ]
};

// User validation rules
const userValidations = {
  register: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.phone,
    commonValidations.password,
    body('address.city').optional().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
    body('address.state').optional().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
    handleValidationErrors
  ],
  
  login: [
    commonValidations.email,
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  
  updateProfile: [
    body('name').optional().isLength({ min: 2, max: 50 }).trim(),
    body('phone').optional().isMobilePhone('en-IN'),
    body('address.street').optional().isLength({ max: 200 }),
    body('address.city').optional().isLength({ min: 2, max: 50 }),
    body('address.state').optional().isLength({ min: 2, max: 50 }),
    body('address.zipCode').optional().isPostalCode('IN'),
    handleValidationErrors
  ],
  
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    commonValidations.password,
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    handleValidationErrors
  ]
};

// Service validation rules
const serviceValidations = {
  create: [
    body('name').isLength({ min: 5, max: 100 }).trim().withMessage('Service name must be between 5 and 100 characters'),
    body('description').isLength({ min: 20, max: 1000 }).trim().withMessage('Description must be between 20 and 1000 characters'),
    body('category').isIn(['AC Services', 'Electrical', 'Plumbing', 'Cleaning', 'Security', 'Maintenance', 'Repair', 'Installation', 'Other']).withMessage('Invalid category'),
    body('pricing.basePrice').isFloat({ min: 1 }).withMessage('Base price must be at least 1'),
    body('duration.estimated').notEmpty().withMessage('Estimated duration is required'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.objectId,
    body('name').optional().isLength({ min: 5, max: 100 }).trim(),
    body('description').optional().isLength({ min: 20, max: 1000 }).trim(),
    body('pricing.basePrice').optional().isFloat({ min: 1 }),
    handleValidationErrors
  ]
};

// Booking validation rules
const bookingValidations = {
  create: [
    body('service').isMongoId().withMessage('Invalid service ID'),
    body('serviceAddress.street').notEmpty().withMessage('Service address is required'),
    body('serviceAddress.city').notEmpty().withMessage('City is required'),
    body('serviceAddress.zipCode').isPostalCode('IN').withMessage('Invalid ZIP code'),
    body('scheduling.preferredDate').isISO8601().toDate().withMessage('Invalid preferred date'),
    body('scheduling.preferredTimeSlot').notEmpty().withMessage('Preferred time slot is required'),
    body('customerInfo.name').optional().isLength({ min: 2, max: 50 }).trim(),
    body('customerInfo.phone').optional().isMobilePhone('en-IN'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.objectId,
    body('status').optional().isIn(['pending', 'confirmed', 'rescheduled', 'in-progress', 'completed', 'cancelled', 'no-show', 'disputed']),
    body('scheduling.scheduledDate').optional().isISO8601().toDate(),
    body('scheduling.scheduledTime').optional().notEmpty(),
    handleValidationErrors
  ],
  
  updateStatus: [
    commonValidations.objectId,
    body('status').isIn(['confirmed', 'rescheduled', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
    body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
    handleValidationErrors
  ]
};

// Review validation rules
const reviewValidations = {
  create: [
    body('booking').isMongoId().withMessage('Invalid booking ID'),
    commonValidations.rating,
    body('comment').isLength({ min: 10, max: 1000 }).trim().withMessage('Comment must be between 10 and 1000 characters'),
    body('breakdown.quality').isFloat({ min: 1, max: 5 }).withMessage('Quality rating must be between 1 and 5'),
    body('breakdown.punctuality').isFloat({ min: 1, max: 5 }).withMessage('Punctuality rating must be between 1 and 5'),
    body('breakdown.behavior').isFloat({ min: 1, max: 5 }).withMessage('Behavior rating must be between 1 and 5'),
    body('breakdown.pricing').isFloat({ min: 1, max: 5 }).withMessage('Pricing rating must be between 1 and 5'),
    body('wouldRecommend').isBoolean().withMessage('Would recommend must be true or false'),
    body('pros').optional().isArray().withMessage('Pros must be an array'),
    body('cons').optional().isArray().withMessage('Cons must be an array'),
    handleValidationErrors
  ]
};

// Provider validation rules
const providerValidations = {
  register: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.phone,
    commonValidations.password,
    body('businessInfo.businessName').optional().isLength({ min: 2, max: 100 }).trim(),
    body('businessInfo.businessType').optional().isIn(['individual', 'company', 'partnership']),
    body('specializations').optional().isArray().withMessage('Specializations must be an array'),
    body('experience.years').optional().isInt({ min: 0, max: 50 }).withMessage('Experience years must be between 0 and 50'),
    handleValidationErrors
  ],
  
  updateProfile: [
    body('name').optional().isLength({ min: 2, max: 50 }).trim(),
    body('phone').optional().isMobilePhone('en-IN'),
    body('businessInfo.businessName').optional().isLength({ min: 2, max: 100 }).trim(),
    body('experience.years').optional().isInt({ min: 0, max: 50 }),
    body('serviceArea.radius').optional().isFloat({ min: 1, max: 100 }).withMessage('Service radius must be between 1 and 100 km'),
    handleValidationErrors
  ]
};

// Query validation rules
const queryValidations = {
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'rating', '-rating', 'price', '-price', 'name', '-name']),
    handleValidationErrors
  ],
  
  search: [
    query('q').optional().isLength({ min: 2, max: 100 }).trim().withMessage('Search query must be between 2 and 100 characters'),
    query('category').optional().isIn(['AC Services', 'Electrical', 'Plumbing', 'Cleaning', 'Security', 'Maintenance', 'Repair', 'Installation', 'Other']),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('rating').optional().isFloat({ min: 1, max: 5 }),
    query('city').optional().isLength({ min: 2, max: 50 }).trim(),
    handleValidationErrors
  ],
  
  dateRange: [
    query('startDate').optional().isISO8601().toDate().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().toDate().withMessage('Invalid end date'),
    query('startDate').optional().custom((value, { req }) => {
      if (req.query.endDate && new Date(value) > new Date(req.query.endDate)) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),
    handleValidationErrors
  ]
};

// Admin validation rules
const adminValidations = {
  createAdmin: [
    commonValidations.name,
    commonValidations.email,
    body('password').isLength({ min: 8, max: 50 }).withMessage('Admin password must be between 8 and 50 characters'),
    body('role').isIn(['super_admin', 'admin', 'moderator', 'support']).withMessage('Invalid admin role'),
    body('personalInfo.department').optional().isLength({ min: 2, max: 50 }).trim(),
    handleValidationErrors
  ],
  
  updateAdmin: [
    commonValidations.objectId,
    body('name').optional().isLength({ min: 2, max: 50 }).trim(),
    body('role').optional().isIn(['super_admin', 'admin', 'moderator', 'support']),
    body('status').optional().isIn(['active', 'inactive', 'suspended']),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  commonValidations,
  userValidations,
  serviceValidations,
  bookingValidations,
  reviewValidations,
  providerValidations,
  queryValidations,
  adminValidations
};