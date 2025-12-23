export const isGreetings = (text = "") => {
  const greetings = [
    "hola",
    "hello",
    "hi",
    "buenas",
    "buenos dias",
    "buenas tardes",
    "buenas noches",
    "cordial saludo",
  ];

  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  return greetings.some((greeting) =>
    normalizedText.includes(greeting)
  );
};
