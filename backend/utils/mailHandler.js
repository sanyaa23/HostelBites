import { emailSender } from "./emailSender.js";

const mailHandler = async (recipientEmail, subject, content) => {
    try {
        const mailResponse = await emailSender(recipientEmail, subject, content);
        console.log("Email sent successfully:", mailResponse);
        return true; // Indicate success
    } catch (error) {
        console.error("Error while sending email:", error.message);
        throw new Error("Failed to send email");
    }
};

export { mailHandler };
