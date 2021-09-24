export function formatDate(date, options) {
    const arrDate = date.split('/');
    const day = Number(arrDate[0]);
    const month = Number(arrDate[1]);
    const year = Number(arrDate[2]);
    const newDate = new Date(year, month - 1, day);
    return newDate.toLocaleString('pt-BR', options);
}
