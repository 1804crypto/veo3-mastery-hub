
/**
 * Simulated email service for development.
 * In production, replace this with a real email provider like SendGrid, AWS SES, or Resend.
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
    console.log('----------------------------------------------------');
    console.log(`[SIMULATED EMAIL] To: ${to}`);
    console.log(`[SIMULATED EMAIL] Subject: ${subject}`);
    console.log(`[SIMULATED EMAIL] Body:`);
    console.log(text);
    console.log('----------------------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return true;
};
