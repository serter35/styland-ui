function getStorageItem (itemKey) {
    const token = JSON.parse(window.localStorage.getItem(itemKey));

    if (token)
    {
        return token;
    }
    return null;
}

function setStorageItem (key, value) {
    value = JSON.stringify(value);
    window.localStorage.setItem(key, value);
}

function removeStorageItem (key) {
    window.localStorage.removeItem(key);
}

export { getStorageItem, setStorageItem, removeStorageItem }