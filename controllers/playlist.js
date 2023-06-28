const analyse = require("../utility/yt");

const fetchTime = async (req, res) => {
    try {
        const { playlist } = req.body;
        const time = await analyse(playlist);
        return res.status(200).json({ status: 'sucess', time });
    } catch (error) {
        res.json({ status: "failure", msg: error.message })
    }
}

module.exports = fetchTime