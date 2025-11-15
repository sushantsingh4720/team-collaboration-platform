const Team = require("../../models/team");
const User = require("../../models/user");
const { createUserValidation } = require("../../utils/validations/user");

const register = async (req, res, next) => {
  try {
    const { value, error } = createUserValidation({
      name: req.body?.name,
      email: req.body?.email,
    });

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error?.details[0]?.message });

    const { name, email } = value;
    const existingUser = await User.findOne({ email: email });
    const team = await Team.findOne();
    console.log(team);
    if (existingUser)
      return res
        .status(200)
        .json({ success: false, message: "Alredy Registerd" });
    await User.create({ name, email, teamId: team?._id });
    res.status(200).json({ success: true, message: "Register successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const allUsers = async (req, res, next) => {
  try {
    const { teamId } = req.query;
    const currentUserId = req.user.id; // From authentication middleware

    const users = await User.find({
      teamId: teamId,
      _id: { $ne: currentUserId }, // Exclude current user
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, register, allUsers };
