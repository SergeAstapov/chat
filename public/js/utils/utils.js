export function generateNickname () {
    return Math.random().toString(36).substr(2, 5);
}