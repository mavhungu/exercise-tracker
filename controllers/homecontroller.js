const homecontroller = async (req, res)=>{
    res.render('index',{
        'title': 'Exercise Tracker | mavhungu Ronewa',
        'home': 'Exercise tracker'
    })
}
const healthcheckcontroller = async (req, res)=>{
    res.json({
        message: 'OK'
    })
}

module.exports= {homecontroller, healthcheckcontroller}