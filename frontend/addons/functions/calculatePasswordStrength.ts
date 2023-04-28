import zxcvbn from "zxcvbn";


export function calculatePasswordStrength(password: string) {
    const result = zxcvbn(password);
    const score = result.score;
    let passwordStrengthText = "";
    switch (result.score) {
        case 0:
            passwordStrengthText = "Weak";
            break;
        case 1:
            passwordStrengthText = "Weak";
            break;
        case 2:
            passwordStrengthText = "Fair";
            break;
        case 3:
            passwordStrengthText = "Good";
            break;
        case 4:
            passwordStrengthText = "Strong";
            break;
        default:
            passwordStrengthText = "Weak";
            break;
    }
    return { score, passwordStrengthText };

}