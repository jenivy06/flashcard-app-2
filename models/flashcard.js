module.exports = function(sequelize, DataTypes) {
  var Flashcard = sequelize.define("Flashcard", {
    textQuestion: {
      type: DataTypes.STRING,
      // AllowNull is a flag that restricts a flashcard text from being entered if it doesn't
      // have a text value
      allowNull: false,
      // len is a validation that checks that our flashcard text is between 1 and 140 characters
      validate: {
        len: [1, 1000]
      }
    },
    complete: {
      type: DataTypes.BOOLEAN,
      // defaultValue is a flag that defaults a new todos complete value to false if
      // it isn't supplied one
      defaultValue: false
    }
  });
  return Flashcard;
};
