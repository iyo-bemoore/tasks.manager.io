const validateBodyParams = (targetSchema, targetObject) => {
  let schemaEntries = [];

  targetSchema.eachPath(entry => schemaEntries.push(entry));

  const bodyKeys = Object.keys(targetObject);

  let isValid = bodyKeys.every(entry => schemaEntries.includes(entry));
  return isValid;
};

module.exports = validateBodyParams;
