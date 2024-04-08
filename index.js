const clipboard = (arg) => {
  navigator.clipboard.writeText(JSON.stringify(arg));
};

export default {
  clipboard,
};
