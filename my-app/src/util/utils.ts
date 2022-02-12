export const getCurrentPlayerName = () : string => {
    const pathName = window.location.pathname;
    return "P"+pathName.substring(2); // get rid of slash, make p uppercase
}