import { User } from "../models/user.model.js";

const generateRefreshandAccessToken = async (userId) => {

   const user = await User.findById(userId)
   const refreshToken = user.generateRefreshToken();
   const accessToken = user.generateAccessToken();
 
   // this segment is used to save the refresh token in the user document
   user.refreshToken = refreshToken;

   //hum ye segment isliye kar rahe hain taaki hum user ki refresh token ko update kar sakein
   await user.save({ validateBeforeSave: false });

   return { refreshToken, accessToken };
}

const userReg = async (req,res) => {
    try {
        const {name,email,password,role}= req.body;

        if(
            [name,email,password].some(field => field?.trim() === '')
        ){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

       const existedUser = await User.findOne({
          $or: [{email}, {name}]
       })

       if(existedUser) {
          return res.status(409).json({
            message: 'Username or email already exists'
          })
       }

       const users = await User.create({
          email,
          password,
          name,
          role:role||"user"
       })

       const createdUser = await User.findById(users._id).select(
          '-password -refreshToken'
       )

       if(!createdUser) {
          return res.status(400).json({
            message:"Failed to create a user"
          })
       }

       return res.status(201).json({
        createdUser,
        message: "User Registered Successfully"
       })
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const loginUser = async (req,res) => {
    try {
        const { email, password, role } = req.body;

        if(!email) {
            return res.status(404).json({
                message:"Please give your registered email"
            })
        }

        const findUser = await User.findOne({ email })

        if(!findUser) {
            return res.status(404).json({
                message:"User not found"
            })
        }

        // Check if the user's role matches the login attempt
        if(findUser.role !== (role || "user")) {
            return res.status(403).json({
                message:`This email is registered as ${findUser.role}, not ${role || "user"}`
            })
        }

        const passwordMatch = await findUser.isPasswordCorrect(password) 

        if(!passwordMatch) {
            return res.status(401).json({
                message:"Password is incorrect"
            })
        }

        const {refreshToken, accessToken} = await generateRefreshandAccessToken(findUser._id)
        
        const loggedInUser = await User.findById(findUser._id).select(
            '-password -refreshToken'
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie('accessToken', accessToken , options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                {
                    findUser: loggedInUser,
                    accessToken,
                    refreshToken,
                    message:"User logged in successfully"
                },
            )
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getUser = async(req,res) => {
    const currentUser = await User.findById(req.user?._id);

    return res
    .status(200)
    .json({
        currentUser,
        message:"User fetched Succesfully"
    })
}

const passwordChange = async (req,res) => {
   const { oldPassword, newPassword } = req.body;

   const user = await User.findById(req.user?._id)

   const passwordCorrect = await user.isPasswordCorrect(oldPassword);

   if(!passwordCorrect) {
      return res.status(200).json({
        message:"The password is not same as old"
      })
   }

   user.password = newPassword;
   await user.save({validateBeforeSave : false});

   return res
   .status(200)
   .json(
       { 
        message:"Password succesfuly changed"
       }
   )
}

export {userReg,loginUser,getUser,passwordChange}