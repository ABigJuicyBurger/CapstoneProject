import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY } = process.env;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: "no JWT provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user) => {
    if (err) return res.sendStatus(403)
    req.user = {
      userId: user.userId,  // Make sure this matches what you're storing in the token
      username: user.username
    };
    next(); 
  })
}

export default authenticateToken;
