const calculateFahrenheitToCelcius = temperature => {
  return (temperature - 32) / 1.8;
};

const calculateCelciusToFahrenheit = temperature => {
  return temperature * 1.8 + 32;
};

module.exports = {
  calculateCelciusToFahrenheit,
  calculateFahrenheitToCelcius
};
