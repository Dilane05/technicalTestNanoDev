export const validateTransaction = (
  value: number,
  receiver: string,
  sender: string
) => {
  if (typeof value !== "number" || value <= 0) {
    return { error: "Invalid transaction value" };
  }
  if (typeof receiver !== "string" || receiver.trim() === "") {
    return { error: "Invalid receiver" };
  }
  if (typeof sender !== "string" || sender.trim() === "") {
    return { error: "Invalid sender" };
  }
  return null; // No validation errors
};
