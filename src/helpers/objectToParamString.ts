export default function objectToParamString(object : Object): string {
  var joinedParams =
    Object.keys(object).map(key => {
      if (key == 'orderBy') {
        return `${key}="${object[key]}"`
      } else {
        return `${key}=${object[key]}`
      }
    }).join('&');
  return joinedParams === '' ? '' : `?${joinedParams}`;
}
