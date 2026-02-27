const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .isIn(['student', 'admin', 'superadmin'])
    .withMessage('Role must be student, admin, or superadmin'),
  body('department')
    .if(body('role').equals('student'))
    .notEmpty()
    .withMessage('Department is required for students'),
  body('year')
    .if(body('role').equals('student'))
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4'),
  body('field')
    .if(body('role').equals('admin'))
    .notEmpty()
    .withMessage('Field is required for admins')
    .isIn(['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical', 'General'])
    .withMessage('Invalid field'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Activity validation
const validateActivity = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .isIn(['Sports', 'Cultural', 'Technical', 'Arts', 'Social Service', 'Academic', 'Leadership'])
    .withMessage('Invalid category'),
  body('field')
    .isIn(['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical', 'General'])
    .withMessage('Invalid field'),
  body('eventDate')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required'),
  handleValidationErrors
];

// Achievement validation
const validateAchievement = [
  body('awardTitle')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Award title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('position')
    .optional()
    .isIn(['1st', '2nd', '3rd', 'Participation', 'Winner', 'Runner-up', 'Special Recognition'])
    .withMessage('Invalid position'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateActivity,
  validateAchievement,
  handleValidationErrors
};