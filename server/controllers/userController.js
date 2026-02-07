import User from "../models/userModel.js";

export const getUser = async (req, res) => {
    try {
        const { username } = req.params;
        console.log('username: ', username);
        const user = await User.findOne({ name: username });
        if (user) {
            res.status(200).json({
                success: true,
                user: user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username } = req.body;
        const user = new User({ name: username });
        await user.save();
        if (user) {
            res.status(200).json({
                success: true,
                user: user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Username not found!!",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
