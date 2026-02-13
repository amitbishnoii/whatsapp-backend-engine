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

export const addFriend = async (req, res) => {
    try {
        const { friendUsername, username } = req.body;
        const friend = await User.findOne({ name: friendUsername });
        if (!friend) {
            res.status(404).json({
                success: false,
                message: "Friend not found!!",
            });
        } else {
            const user = await User.findOneAndUpdate(
                { name: username },
                { $push: { friends: friend.name } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ success: true, user });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
