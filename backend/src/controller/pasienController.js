const registerPasien = async (req, res) => {
  console.log(req.body);
  res.send(`Your name is ${req.body.name}`);
};

export default { registerPasien };
