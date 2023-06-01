function estimatedDate(currentDate, estimateBy) {
    var estimateD = new Date(currentDate)
    estimateD.setDate(estimateD.getDate() + estimateBy)
    return estimateD.toISOString().split('T')[0]
}
// var xdate = new Date().toISOString().split('T')[0]
// console.log(estimatedDate(xdate, 1))

module.exports = estimatedDate