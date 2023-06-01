const express = require("express")
const actions = require("../methods/actions")
const router = express.Router()


router.get("/", (req, res) => {
    res.send("Welcome to Bole by Joe!")
})

// USER APIs
//Upload profile image
router.post("/api/v1/upload-profile-image", actions.profileImage)
//User sign up
router.post("/api/v1/signup", actions.signup)
//User sign up email validation
router.post("/api/v1/validate_signup", actions.signupValidation)
//User sign in
router.post("/api/v1/signin", actions.signin)
//Remain signed in if token is not expired
router.post("/api/v1/restore-signin", actions.restoreSignin)
//Validate token
const auth = require("./auth");
router.post("/api/v1/validate", auth, actions.validate)
//Check for package eligibility
router.post("/api/v1/check-for-package-eligibility", actions.checkEligibilityForDiscountedPackage)
//Retrieve discounted packages
router.post("/api/v1/discounted-packages", actions.fetchDiscountedPackages)
//Retrieve normal packages
router.post("/api/v1/normal-packages", actions.fetchNormalPackages)
//Retrieve locations
router.post("/api/v1/my-locations", actions.fetchMyLocations)
//Delete location
router.post("/api/v1/delete-location", actions.deleteLocation)
//Add location
router.post("/api/v1/add-location", actions.addLocation)
//Log a complaint
router.post("/api/v1/log-complaint", actions.logComplaint)
//Retrieve user complaints
router.post("/api/v1/my-complaints", actions.fetchMyComplaints)
//Apply for refund
router.post("/api/v1/apply-for-refund", actions.applyForRefund)
//Retrieve refund applications
router.post("/api/v1/my-refunds", actions.fetchMyRefunds)
//Check for PoD eligibility
router.post("/api/v1/check-for-pod-eligibility", actions.checkForPODEligibility)
//Check for unique order id
router.post("/api/v1/validate-orderid", actions.validateOrderId)
//Place order
router.post("/api/v1/place-order", actions.placeOrder)
//Cancel order
router.post("/api/v1/cancel-order", actions.cancelOrder)
//Retrieve orders
router.post("/api/v1/my-orders", actions.fetchMyOrders)
//Retrieve active delivery requests
router.post("/api/v1/active-delivery-requests", actions.fetchActiveDeliveryOrders)
//Retrieve completed delivery requests
router.post("/api/v1/completed-delivery-requests", actions.fetchCompletedDeliveryOrders)
//Retrieve user info
router.post("/api/v1/user-info", actions.fetchUser)
//Retrieve dispatcher info
router.post("/api/v1/dispatcher-info", actions.fetchDispatcher)
//Accept delivery request
router.post("/api/v1/accept-order", actions.acceptOrder)
//Mark delivery request as delivered
router.post("/api/v1/mark-as-delivered", actions.markAsDelivered)
//Rate dispatcher
router.post("/api/v1/rate-dispatcher", actions.rateDispatcher)
//Don't rate dispatcher
router.post("/api/v1/dont-rate-dispatcher", actions.dontRateDispatcher)
//Rate package
router.post("/api/v1/rate-package", actions.ratePackage)
//Verify password
router.post("/api/v1/verify-password", actions.verifyPassword)
//Update password
router.post("/api/v1/update-password", actions.updatePassword)
//Update profile
router.post("/api/v1/update-profile", actions.updateProfile)
//Validate email and send auth code as mail
router.post("/api/v1/validate-email", actions.validateEmailAndSendCode)


// ADMIN APIs
//Admin sign up
router.post("/api/v2/admin-signup", actions.adminSignup)
//Admin sign in
router.post("/api/v2/admin-signin", actions.adminSignin)
//Remain signed in if token is not expired
router.post("/api/v2/restore-signin", actions.restoreSigninAdmin)
//Upload package cover image
router.post("/api/v2/upload-package-cover-image", actions.coverImage)
//Upload package images
router.post("/api/v2/upload-package-image", actions.image)
//Add a package
router.post("/api/v2/add-package", actions.addPackage)
//Update a package
router.post("/api/v2/update-package", actions.updatePackage)
//Delete a package
router.post("/api/v2/delete-package", actions.deletePackage)
//Retrieve all packages
router.post("/api/v2/all-packages", actions.fetchAllPackages)
//Update user account
router.post("/api/v2/update-account", actions.updateAccount)
//Convert user account
router.post("/api/v2/convert-account", actions.convertAccount)
//Suspend user account
router.post("/api/v2/suspend-account", actions.suspendAccount)
//Retrieve all accounts
router.post("/api/v2/all-accounts", actions.fetchAllAccounts)
//Retrieve all orders
router.post("/api/v2/all-orders", actions.fetchAllOrders)
//Retrieve all locations
router.post("/api/v2/all-locations", actions.fetchAllLocations)
//Approve refund application
router.post("/api/v2/approve-refund-application", actions.approveRefund)
//Deny refund application
router.post("/api/v2/deny-refund-application", actions.denyRefund)
//Reset refund application
router.post("/api/v2/reset-refund-application", actions.resetRefund)
//Retrieve all refund applications
router.post("/api/v2/all-refunds", actions.fetchAllRefunds)
//Retrieve all refund applications
router.post("/api/v2/all-complaints", actions.fetchAllComplaints)
//Retrieve all user data logs
router.post("/api/v2/all-user-data-logs", actions.fetchUserDataLogs)
//Delete specific data logs
router.post("/api/v2/delete-data-logs", actions.deleteSpecificDataLogs)
//Retrieve all data logs
router.post("/api/v2/all-data-logs", actions.fetchAllDataLogs)
//Delete user account
router.post("/api/v2/delete-account", actions.deleteAccount)

module.exports = router