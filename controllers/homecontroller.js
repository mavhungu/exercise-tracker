const homecontroller = async (req, res)=>{
    res.render('index',{
        'title': 'Exercise Tracker | mavhungu Ronewa',
        'home': 'Exercise tracker'
    })
}

module.exports= homecontroller