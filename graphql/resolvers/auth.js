const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });

      if (user) {
        throw new Error("User exists already.");
      }
      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const createdUser = new User({
        email: args.userInput.email,
        password: hashPassword
      });
      const res = await createdUser.save();

      return { ...res._doc, password: null, _id: res.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email});
    if(!user){
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual){
      throw new Error("Invalid Credentials!");
    }
    const token = await jwt.sign({userId: user.id, email: user.email},  "SomeSecretKey",{
      expiresIn: '1h'
    });
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
};
