function estimatedTime(currentDateTime, estimateBy) {
    var estimateT = new Date(Date.now(currentDateTime) + 1 * (60 * 60 * 1000))
    estimateT.setMinutes(estimateT.getMinutes() + estimateBy)
    return estimateT.toISOString().split('T')[1].split(".")[0]
}
// var xtime = new Date()
// console.log(estimatedTime(xtime, 90))

module.exports = estimatedTime