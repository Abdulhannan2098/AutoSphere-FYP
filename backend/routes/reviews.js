const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { reviewValidation } = require('../utils/validators');

router.post('/:productId', protect, authorize('customer'), reviewValidation, createReview);
router.get('/:productId', getProductReviews);

module.exports = router;