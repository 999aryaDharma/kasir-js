const { validationResult, body } = require("express-validator");

const validateProduct = [
	body("name").notEmpty().withMessage("Name is required"),
	body("costPrice").isFloat({ gt: 0 }).withMessage("Cost price must greater than 0"),
	body("sellingPrice").isFloat({ gt: 0 }).withMessage("Selling price must greater than 0"),
	body("categoryId").isInt({ gt: 0 }).withMessage("Category ID must be a positive integer"),
	// middleware to check validation result
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				})),
			});
		}
		next();
	},
];

module.exports = {
	validateProduct,
};
