const fetchTime = async (req, res) => {
    try {
        const { playlist } = req.body;

        return res.status(200).json({ status: 'sucess', token });
    } catch (error) {
        res.json({ status: "failure", msg: error.message })
    }
}

module.exports = fetchTime