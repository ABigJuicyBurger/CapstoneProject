import bcrypt from "bcrypt";

const saltRounds = 10;

const users = [
  {
    id: 1,
    username: "testUser",
    email: "testUser@testEmail.com",
    password_hash: bcrypt.hashSync("testUser", saltRounds),
    avatar: "images/test.png",
  },
];

export default users;
