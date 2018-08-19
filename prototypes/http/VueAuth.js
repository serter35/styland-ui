import { oauth_token_key }                      from "../../../../styland.env";
import { getStorageItem, removeStorageItem }    from "../local-storage/Handler";

const getAccessToken = () => {
    const tokens = getStorageItem(oauth_token_key);
    if (tokens !== null) {
        return tokens.token_type + ' ' + tokens.access_token;
    }
    return;
}
const checkRole = ({ role }, searchRole) => {
    if (Array.isArray(searchRole)) {
        return searchRole.some(searchRoleItem => role.some(userRoleItem => userRoleItem.name == searchRoleItem))
    } else if (typeof searchRole === "string") {
        return role.some(userRoleItem => userRoleItem.name == searchRole)
    }
    return false;
}
const checkPermission = ({ role }, searchPermission) => {
    if (Array.isArray(role)) {
        return role.some(roleItem => {
            if (Array.isArray(roleItem.permission)) {
                return roleItem.permission.some(permissionItem => permissionItem.name === searchPermission)
            }
            return false
        })
    }
    return false;
}

const redirectLogin = (store) => {
    removeStorageItem(oauth_token_key);
    store.dispatch('setAuthUser', null);
    return '/login';
}

export { getAccessToken, checkRole, checkPermission, redirectLogin }