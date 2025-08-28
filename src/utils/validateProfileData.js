const express = require("express");
var validator = require("validator");

const validateProfileData = (req) => {
  const allowerdEditField = [
    "firstName",
    "lastName",
    "description",
    "skills",
    "photoUrl",
    "age",
    "gender",
  ];

  const isValidtoUpdate = Object.keys(req.body).every((field) =>
    allowerdEditField.includes(field)
  );
  return isValidtoUpdate;
};
const ValidatePassword = (req) => {
  if (!validator.isStrongPassword(req)) {
    throw new Error(
      "Password is not strong it should contain 1lowercase , 1uppercase ,1 specialcharacter,minLength:8"
    );
  }
};
module.exports = { validateProfileData, ValidatePassword };
