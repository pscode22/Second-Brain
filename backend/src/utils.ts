export const randomString = (reqLength : number) => {
    const str = 'qwrtyuioplkjhgfdsazxcvbnm0123456789'
    const strLength = str.length;

    let randomStr = ''

    for(let i = 0; i < reqLength; i++) {
        const selected = str[Math.floor(Math.random() * strLength)]
        randomStr +=  selected
    }

    return randomStr;
}